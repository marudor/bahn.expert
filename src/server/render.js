// @flow
import { setCookies } from 'client/actions/config';
// $FlowFixMe
import { createGenerateClassName, MuiThemeProvider } from '@material-ui/core/styles';
import { HelmetProvider } from 'react-helmet-async';
import { matchPath, Router } from 'react-router';
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

function matchRoutes(routes, pathname, /* not public API*/ branch = []) {
  routes.forEach(route => {
    // eslint-disable-next-line no-nested-ternary
    const match = route.path
      ? matchPath(pathname, route)
      : branch.length
      ? branch[branch.length - 1].match // use parent match
      : // $FlowFixMe
        Router.computeRootMatch(pathname); // use default "root" match

    if (match) {
      branch.push({ route, match });

      // $FlowFixMe
      if (route.routes) {
        matchRoutes(route.routes, pathname, branch);
      }
    }
  });

  return branch;
}

// eslint-disable-next-line
const headerEjs = fs.readFileSync(path.resolve(__dirname, './views/header.ejs'), 'utf8');
const headerTemplate = ejs.compile(headerEjs);
// eslint-disable-next-line
const footerEjs = fs.readFileSync(path.resolve(__dirname, './views/footer.ejs'), 'utf8');
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

  await Promise.all(
    matchRoutes(routes, ctx.req.url).map(({ route, match }) =>
      route.component.loadData
        ? // $FlowFixMe
          route.component.loadData(store, match).catch(() => Promise.resolve())
        : Promise.resolve()
    )
  );

  const app = renderStylesToString(
    renderToString(
      <Provider store={store}>
        <HelmetProvider context={helmetContext}>
          <JssProvider registry={sheetsRegistry} generateClassName={generateClassName}>
            <MuiThemeProvider theme={theme} sheetsManager={sheetsManager}>
              <StaticRouter location={ctx.req.url} context={routeContext}>
                <BahnhofsAbfahrten />
              </StaticRouter>
            </MuiThemeProvider>
          </JssProvider>
        </HelmetProvider>
      </Provider>
    )
  );

  if (routeContext.url) {
    ctx.redirect(routeContext.url);
  } else {
    const state = store.getState();

    delete state.config.cookies;

    const materialCss = sheetsRegistry.toString();

    ctx.body = headerTemplate({
      header: helmetContext.helmet,
      cssBundles: ctx.stats.main.css,
      materialCss,
      clientState: JSON.stringify(state),
    });
    ctx.body += app;
    ctx.body += footerTemplate({
      jsBundles: ctx.stats.main.js,
    });
  }
};
