import { configSanitize } from 'client/util';
import { Context } from 'koa';
import { getFeatures } from './features';
import { Helmet } from 'react-helmet';
import { isEnabled } from 'unleash-client';
import { MarudorConfigSanitize } from 'Common/config';
import { matchRoutes } from 'react-router-config';
import { Provider } from 'react-redux';
// import { renderStylesToString } from 'emotion-server';
import { renderToString } from 'react-dom/server';
import { ServerStyleSheets } from '@material-ui/styles';
import { setConfig, setFromCookies } from 'Abfahrten/actions/abfahrtenConfig';
import { StaticRouter } from 'react-router-dom';
import { StaticRouterContext } from 'react-router';
import { ThemeType } from 'client/Themes/type';
import abfahrtenRoutes from 'Abfahrten/routes';
import ConfigActions, { setCookies, setTheme } from 'Common/actions/config';
import createStore from 'client/createStore';
import ejs from 'ejs';
import fs from 'fs';
import path from 'path';
import React from 'react';
import routingRoutes from 'Routing/routes';
import serialize from 'serialize-javascript';
import ThemeWrap from 'client/ThemeWrap';

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

  const store = createStore({
    features: getFeatures(),
  });

  const configOverride = {};

  await store.dispatch(setCookies(ctx.request.universalCookies));
  await store.dispatch(setFromCookies());
  if (ctx.query.theme) {
    const queryTheme = ThemeType[ctx.query.theme] as undefined | ThemeType;

    if (queryTheme) {
      store.dispatch(setTheme(queryTheme));
    }
  }
  Object.keys(ctx.query).forEach((key: any) => {
    if (configSanitize.hasOwnProperty(key)) {
      const value = configSanitize[key as keyof MarudorConfigSanitize](
        ctx.query[key]
      );

      // @ts-ignore this works
      configOverride[key] = value;
      store.dispatch(setConfig(key, value, true));
    }
  });

  store.dispatch(ConfigActions.setBaseUrl(process.env.BASE_URL || ''));
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
      <StaticRouter location={ctx.path} context={routeContext}>
        <ThemeWrap />
      </StaticRouter>
    </Provider>
  );

  const sheets = new ServerStyleSheets();
  const app = renderToString(sheets.collect(App));

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
      header: Helmet.renderStatic(),
      cssBundles: ctx.stats.main.css,
      clientState: serialize(state),
      configOverride: serialize(configOverride),
      imprint: serialize(global.IMPRINT),
      jssCss: sheets.toString(),
    });
    ctx.body += app;

    ctx.body += footerTemplate({
      jsBundles: ctx.stats.main.js,
    });
  }
};
