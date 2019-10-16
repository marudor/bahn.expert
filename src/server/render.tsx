import { ChunkExtractor } from '@loadable/server';
import { configSanitize } from 'client/util';
import { Context } from 'koa';
import { CookieContext } from 'Common/useCookies';
import { HelmetProvider } from 'react-helmet-async';
import { MarudorConfigSanitize } from 'Common/config';
import { renderToString } from 'react-dom/server';
import { ServerStyleSheets } from '@material-ui/styles';
import { setCookieOptions } from 'client/util';
import { StaticRouter } from 'react-router-dom';
import { StaticRouterContext } from 'react-router';
import { ThemeProvider } from 'Common/container/ThemeContainer';
import ejs from 'ejs';
import fs from 'fs';
import path from 'path';
import React from 'react';
import serialize from 'serialize-javascript';
import ThemeWrap from 'client/ThemeWrap';

global.baseUrl = process.env.BASE_URL || '';
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

export default (ctx: Context) => {
  const extractor = new ChunkExtractor({ stats: ctx.loadableStats });
  const selectedDetail = ctx.query.selectedDetail;

  if (selectedDetail) {
    ctx.request.universalCookies.set(
      'selectedDetail',
      selectedDetail,
      setCookieOptions
    );
  }
  const routeContext: StaticRouterContext = {};

  global.configOverride = {};

  Object.keys(ctx.query).forEach((key: any) => {
    switch (key) {
      default:
        if (configSanitize.hasOwnProperty(key)) {
          const value = configSanitize[key as keyof MarudorConfigSanitize](
            ctx.query[key]
          );

          global.configOverride[key] = value;
        }
        break;
    }
  });

  const context: any = {};
  const App = extractor.collectChunks(
    <HelmetProvider context={context}>
      <StaticRouter location={ctx.url} context={routeContext}>
        <CookieContext.Provider value={ctx.request.universalCookies}>
          <ThemeProvider>
            <ThemeWrap />
          </ThemeProvider>
        </CookieContext.Provider>
      </StaticRouter>
    </HelmetProvider>
  );

  const sheets = new ServerStyleSheets();
  const app = renderToString(sheets.collect(App));

  if (routeContext.url) {
    ctx.redirect(routeContext.url);
  } else {
    if (routeContext.status) {
      ctx.status = routeContext.status;
    }

    ctx.body = headerTemplate({
      tagmanager: process.env.TAGMANAGER_ID,
      header: context.helmet,
      cssTags: extractor.getStyleTags(),
      linkTags: extractor.getLinkTags(),
      configOverride: serialize(global.configOverride),
      imprint: serialize(global.IMPRINT),
      jssCss: sheets.toString(),
      baseUrl: global.baseUrl,
    });
    ctx.body += app;

    ctx.body += footerTemplate({
      scriptTags: extractor.getScriptTags(),
    });
  }
};
