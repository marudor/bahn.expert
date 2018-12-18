// @flow
// $FlowFixMe
import { createGenerateClassName, MuiThemeProvider } from '@material-ui/core/styles';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import { renderStylesToString } from 'emotion-server';
import { renderToString } from 'react-dom/server';
import { StaticRouter as Router } from 'react-router-dom';
// $FlowFixMe
import { SheetsRegistry } from 'jss';
import BahnhofsAbfahrten from 'client/Components/BahnhofsAbfahrten';
import createStore from 'client/createStore';
import createTheme from 'client/createTheme';
import ejs from 'ejs';
import fs from 'fs';
import JssProvider from 'react-jss/lib/JssProvider';
import path from 'path';
import React from 'react';

// eslint-disable-next-line
const headerEjs = fs.readFileSync(path.resolve(__dirname, './views/header.ejs'), 'utf8');
const headerTemplate = ejs.compile(headerEjs);
// eslint-disable-next-line
const footerEjs = fs.readFileSync(path.resolve(__dirname, './views/footer.ejs'), 'utf8');
const footerTemplate = ejs.compile(footerEjs);

export default (ctx: any) => {
  const theme = createTheme();
  const generateClassName = createGenerateClassName();
  const sheetsManager = new Map();
  const sheetsRegistry = new SheetsRegistry();
  const routeContext = {};
  const helmetContext = {};
  const store = createStore();
  const app = renderStylesToString(
    renderToString(
      <Provider store={store}>
        <Router location={ctx.req.url} context={routeContext}>
          <HelmetProvider context={helmetContext}>
            <JssProvider registry={sheetsRegistry} generateClassName={generateClassName}>
              <MuiThemeProvider theme={theme} sheetsManager={sheetsManager}>
                <BahnhofsAbfahrten />
              </MuiThemeProvider>
            </JssProvider>
          </HelmetProvider>
        </Router>
      </Provider>
    )
  );

  if (routeContext.url) {
    ctx.redirect(routeContext.url);
  } else {
    const state = store.getState();

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
