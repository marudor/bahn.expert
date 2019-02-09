// @flow
import { Actions, setCookies } from 'client/actions/config';
// $FlowFixMe
import { createGenerateClassName, MuiThemeProvider } from '@material-ui/core/styles';
import { HelmetProvider } from 'react-helmet-async';
import { matchRoutes } from 'react-router-config';
import { Provider } from 'react-redux';
import { renderStylesToString } from 'emotion-server';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
// $FlowFixMe
import { SheetsRegistry } from 'jss';
import BahnhofsAbfahrten from 'client/Components/BahnhofsAbfahrten';
import Cookies from 'universal-cookie';
import createStore from 'client/createStore';
import createTheme from 'client/createTheme';
import ejs from 'ejs';
import fs from 'fs';
import JssProvider from 'react-jss/lib/JssProvider';
import path from 'path';
import React from 'react';
import routes from 'client/routes';
import serialize from 'fast-safe-stringify';

// eslint-disable-next-line
const headerEjs = fs.readFileSync(path.resolve(__dirname, './views/header.ejs'), 'utf8').trim();
const headerTemplate = ejs.compile(headerEjs);
// eslint-disable-next-line
const footerEjs = fs.readFileSync(path.resolve(__dirname, './views/footer.ejs'), 'utf8').trim();
const footerTemplate = ejs.compile(footerEjs);

export default async (ctx: any) => {
  const theme = createTheme();
  const generateClassName = createGenerateClassName();
  const sheetsManager = new Map();
  const sheetsRegistry = new SheetsRegistry();
  const routeContext = {};
  const helmetContext = {};
  const store = createStore();

  store.dispatch(setCookies(new Cookies(ctx.req.headers.cookie)));
  store.dispatch(Actions.setBaseUrl(`${ctx.protocol}://${String(process.env.BASE_URL)}`));

  await Promise.all(
    matchRoutes(routes, ctx.req.url).map(({ route, match }) =>
      route.component.loadData ? route.component.loadData(store, match) : Promise.resolve()
    )
  );

  const App = (
    <Provider store={store}>
      <JssProvider registry={sheetsRegistry} generateClassName={generateClassName}>
        <MuiThemeProvider theme={theme} sheetsManager={sheetsManager}>
          <HelmetProvider context={helmetContext}>
            <StaticRouter location={ctx.req.url} context={routeContext}>
              <BahnhofsAbfahrten />
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
      header: helmetContext.helmet,
      cssBundles: ctx.stats.main.css,
      clientState: serialize(state),
    });
    ctx.body += app;
    const materialCss = sheetsRegistry.toString();

    ctx.body += footerTemplate({
      jsBundles: ctx.stats.main.js,
      materialCss,
    });
  }
};
