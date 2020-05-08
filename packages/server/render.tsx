import { abfahrtenConfigSanitize, commonConfigSanitize } from 'client/util';
import { ChunkExtractor } from '@loadable/server';
import { renderToString } from 'react-dom/server';
import { SheetsRegistry } from 'jss';
import ejs from 'ejs';
import fs from 'fs';
import path from 'path';
import ServerBaseComponent from 'client/ServerBaseComponent';
import type {
  AbfahrtenConfigSanitize,
  CommonConfigSanitize,
} from 'client/Common/config';
import type { Context } from 'koa';
import type { StaticRouterContext } from 'react-router';

const headerFilename = path.resolve(__dirname, './views/header.ejs');
// eslint-disable-next-line no-sync
const headerEjs = fs.readFileSync(headerFilename, 'utf8').trim();
const headerTemplate = ejs.compile(headerEjs, {
  filename: headerFilename,
});
// eslint-disable-next-line no-sync
const footerEjs = fs
  .readFileSync(path.resolve(__dirname, './views/footer.ejs'), 'utf8')
  .trim();
const footerTemplate = ejs.compile(footerEjs);

export default (ctx: Context) => {
  const extractor = new ChunkExtractor({ stats: ctx.loadableStats });
  const selectedDetail = ctx.query.selectedDetail;

  if (selectedDetail) {
    ctx.request.storage.set('selectedDetail', selectedDetail);
  }
  const routeContext: StaticRouterContext = {};

  global.configOverride = {
    common: {},
    abfahrten: {},
  };

  Object.keys(ctx.query).forEach((key: any) => {
    if (commonConfigSanitize.hasOwnProperty(key)) {
      const value = commonConfigSanitize[key as keyof CommonConfigSanitize](
        ctx.query[key]
      );

      global.configOverride.common[key] = value;
    }
    if (abfahrtenConfigSanitize.hasOwnProperty(key)) {
      const value = abfahrtenConfigSanitize[
        key as keyof AbfahrtenConfigSanitize
      ](ctx.query[key]);

      global.configOverride.abfahrten[key] = value;
    }
  });

  const context: any = {};
  const sheets = new SheetsRegistry();
  const App = extractor.collectChunks(
    <ServerBaseComponent
      helmetContext={context}
      url={ctx.url}
      routeContext={routeContext}
      storage={ctx.request.storage}
      sheetsRegistry={sheets}
    />
  );

  const app = renderToString(App);

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
      configOverride: JSON.stringify(global.configOverride),
      imprint: JSON.stringify(global.IMPRINT),
      jssCss: sheets.toString(),
      baseUrl: global.baseUrl,
      version: global.VERSION,
    });
    ctx.body += app;

    ctx.body += footerTemplate({
      scriptTags: extractor.getScriptTags(),
    });
  }
};
