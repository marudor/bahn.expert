// @flow
import { getFeatures } from './features';
import { HelmetProvider } from 'react-helmet-async';
import { isEnabled } from 'unleash-client';
import { matchRoutes } from 'react-router-config';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { Provider } from 'react-redux';
import { renderStylesToString } from 'emotion-server';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import Actions, { setCookies } from 'Abfahrten/actions/config';
import Cookies from 'universal-cookie';
import createJssProviderProps from 'client/createJssProviderProps';
import createStore from 'client/createStore';
import createTheme from 'client/createTheme';
import ejs from 'ejs';
import fs from 'fs';
import JssProvider from 'react-jss/lib/JssProvider';
import MainApp from 'client/App';
import path from 'path';
import React from 'react';
import routes from 'Abfahrten/routes';
import serialize from 'fast-safe-stringify';

const headerFilename = path.resolve(__dirname, './views/header.ejs');
// eslint-disable-next-line
const headerEjs = fs.readFileSync(headerFilename, 'utf8').trim();
const headerTemplate = ejs.compile(headerEjs, {
  filename: headerFilename,
});
// eslint-disable-next-line
const footerEjs = fs.readFileSync(path.resolve(__dirname, './views/footer.ejs'), 'utf8').trim();
const footerTemplate = ejs.compile(footerEjs);

export default async (ctx: any) => {
  const theme = createTheme();
  const sheetsManager = new Map();
  const routeContext = {};
  const helmetContext = {};

  const store = createStore({
    features: getFeatures(),
  });

  store.dispatch(setCookies(new Cookies(ctx.req.headers.cookie)));
  // $FlowFixMe we already checked that BASE_URL exists
  store.dispatch(Actions.setBaseUrl(process.env.BASE_URL));

  await Promise.all(
    matchRoutes(routes, ctx.req.url).map(({ route, match }) =>
      route.component.loadData ? route.component.loadData(store, match) : Promise.resolve()
    )
  );

  const jssProps = createJssProviderProps();

  const App = (
    <Provider store={store}>
      <JssProvider {...jssProps}>
        <MuiThemeProvider theme={theme} sheetsManager={sheetsManager}>
          <HelmetProvider context={helmetContext}>
            <StaticRouter location={ctx.req.url} context={routeContext}>
              <MainApp />
            </StaticRouter>
          </HelmetProvider>
        </MuiThemeProvider>
      </JssProvider>
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
    // $FlowFixMe
    const jssCss = jssProps.registry?.toString();

    ctx.body += footerTemplate({
      jsBundles: ctx.stats.main.js,
      jssCss,
    });
  }
};
