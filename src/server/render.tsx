import { configSanitize } from 'client/util';
import { Context } from 'koa';
import { getFeatures } from './features';
import { HelmetProvider } from 'react-helmet-async';
import { isEnabled } from 'unleash-client';
import { MarudorConfigSanitize } from 'Common/config';
import { matchRoutes } from 'react-router-config';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { Provider } from 'react-redux';
import { renderStylesToString } from 'emotion-server';
import { renderToString } from 'react-dom/server';
import { SheetsRegistry } from 'jss';
import { StaticRouter } from 'react-router-dom';
import { StaticRouterContext } from 'react-router';
import { StylesProvider } from '@material-ui/styles';
import abfahrtenRoutes from 'Abfahrten/routes';
import Actions, { setCookies } from 'Abfahrten/actions/config';
import createStore from 'client/createStore';
import createStyleProviderProps from 'client/createStylesProviderProps';
import createTheme from 'client/createTheme';
import ejs from 'ejs';
import fs from 'fs';
import MainApp from 'client/App';
import path from 'path';
import React from 'react';
import routingRoutes from 'Routing/routes';
import serialize from 'serialize-javascript';

const headerFilename = path.resolve(__dirname, './views/header.ejs');
// eslint-disable-next-line
const headerEjs = fs.readFileSync(headerFilename, 'utf8').trim();
const headerTemplate = ejs.compile(headerEjs, {
  filename: headerFilename,
});
// eslint-disable-next-line
const footerEjs = fs
  .readFileSync(path.resolve(__dirname, './views/footer.ejs'), 'utf8')
  .trim();
const footerTemplate = ejs.compile(footerEjs);

export default async (ctx: Context) => {
  const theme = createTheme();
  const sheetsManager = new Map();
  const routeContext: StaticRouterContext = {};
  const helmetContext: any = {};

  const store = createStore({
    features: getFeatures(),
  });

  await store.dispatch(setCookies(ctx.request.universalCookies));
  Object.keys(ctx.query).forEach((key: any) => {
    if (configSanitize.hasOwnProperty(key)) {
      store.dispatch(
        Actions.setConfig({
          key,
          value: configSanitize[key as keyof MarudorConfigSanitize](
            ctx.query[key]
          ),
        })
      );
    }
  });

  // @ts-ignore we already checked that BASE_URL exists
  store.dispatch(Actions.setBaseUrl(process.env.BASE_URL));
  const routes = ctx.path.startsWith('/routing')
    ? routingRoutes
    : abfahrtenRoutes;

  await Promise.all(
    matchRoutes(routes, ctx.path).map(({ route, match }) => {
      let component: any = route.component;

      while (component && (component.Naked || component.WrappedComponent)) {
        component = component.Naked || component.WrappedComponent;
      }

      if (component && component.loadData) {
        return component.loadData(store, match);
      }

      return Promise.resolve();
    })
  );

  const sheetsRegistry = new SheetsRegistry();

  const App = (
    <Provider store={store}>
      <StylesProvider
        sheetsRegistry={sheetsRegistry}
        sheetsManager={sheetsManager}
        {...createStyleProviderProps()}
      >
        <MuiThemeProvider theme={theme} sheetsManager={sheetsManager}>
          <HelmetProvider context={helmetContext}>
            <StaticRouter location={ctx.path} context={routeContext}>
              <MainApp />
            </StaticRouter>
          </HelmetProvider>
        </MuiThemeProvider>
      </StylesProvider>
    </Provider>
  );

  const app = renderStylesToString(renderToString(App));

  if (routeContext.url) {
    ctx.redirect(routeContext.url);
  } else {
    if (routeContext.status) {
      ctx.status = routeContext.status;
    }
    const state = store.getState();

    delete state.config.cookies;

    ctx.body = headerTemplate({
      googleAnalytics: isEnabled('google-analytics'),
      header: helmetContext.helmet,
      cssBundles: ctx.stats.main.css,
      clientState: serialize(state),
    });
    ctx.body += app;

    ctx.body += footerTemplate({
      jsBundles: ctx.stats.main.js,
      jssCss: sheetsRegistry.toString(),
    });
  }
};
