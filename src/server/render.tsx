import { configSanitize } from 'client/util';
import { Context } from 'koa';
import { getFeatures } from './features';
import { HelmetProvider } from 'react-helmet-async';
import { isEnabled } from 'unleash-client';
import { MarudorConfigSanitize } from 'Common/config';
import { matchRoutes } from 'react-router-config';
import { Provider } from 'react-redux';
import { renderStylesToString } from 'emotion-server';
import { renderToString } from 'react-dom/server';
import { ServerStyleSheets, ThemeProvider } from '@material-ui/styles';
import { StaticRouter } from 'react-router-dom';
import { StaticRouterContext } from 'react-router';
import abfahrtenRoutes from 'Abfahrten/routes';
import Actions, { setCookies } from 'Abfahrten/actions/config';
import createStore from 'client/createStore';
import ejs from 'ejs';
import fs from 'fs';
import MainApp from 'client/App';
import maruTheme from 'client/Themes';
import muiTheme from 'client/Themes/mui';
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
          temp: true,
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

  const App = (
    <Provider store={store}>
      <ThemeProvider theme={{ ...muiTheme, ...maruTheme }}>
        <HelmetProvider context={helmetContext}>
          <StaticRouter location={ctx.path} context={routeContext}>
            <MainApp />
          </StaticRouter>
        </HelmetProvider>
      </ThemeProvider>
    </Provider>
  );

  const sheets = new ServerStyleSheets();
  const app = renderStylesToString(renderToString(sheets.collect(App)));

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
      jssCss: sheets.toString(),
    });
  }
};
