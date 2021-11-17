import { abfahrtenConfigSanitize, commonConfigSanitize } from 'client/util';
import { ChunkExtractor } from '@loadable/server';
import { renderToString } from 'react-dom/server';
import { sanitizeStorage } from 'server/sanitizeStorage';
import { ServerBaseComponent } from 'client/ServerBaseComponent';
import { SheetsRegistry } from 'jss';
import ejs from 'ejs';
import fs from 'fs';
import path from 'path';
import type {
  AbfahrtenConfigSanitize,
  CommonConfigSanitize,
} from 'client/Common/config';
import type { Context } from 'koa';

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

export default (ctx: Context): void => {
  const extractor = new ChunkExtractor({ stats: ctx.loadableStats });
  const selectedDetail = ctx.query.selectedDetail;

  if (selectedDetail && typeof selectedDetail == 'string') {
    ctx.request.storage.set('selectedDetail', selectedDetail);
  }

  sanitizeStorage(ctx.request.storage);

  globalThis.configOverride = {
    common: {},
    abfahrten: {},
  };

  Object.keys(ctx.query).forEach((key: any) => {
    if (commonConfigSanitize.hasOwnProperty(key)) {
      const value = commonConfigSanitize[key as keyof CommonConfigSanitize](
        ctx.query[key],
      );

      globalThis.configOverride.common[key] = value;
    }
    if (abfahrtenConfigSanitize.hasOwnProperty(key)) {
      const value = abfahrtenConfigSanitize[
        key as keyof AbfahrtenConfigSanitize
      ](ctx.query[key]);

      globalThis.configOverride.abfahrten[key] = value;
    }
  });

  const context: any = {};
  const sheets = new SheetsRegistry();
  const App = extractor.collectChunks(
    <ServerBaseComponent
      helmetContext={context}
      url={ctx.url}
      storage={ctx.request.storage}
      sheetsRegistry={sheets}
    />,
  );

  // eslint-disable-next-line testing-library/render-result-naming-convention
  const app = renderToString(App);
  ctx.body = headerTemplate({
    header: context.helmet,
    cssTags: extractor.getStyleTags(),
    linkTags: extractor.getLinkTags(),
    configOverride: JSON.stringify(globalThis.configOverride),
    imprint: JSON.stringify(globalThis.IMPRINT),
    jssCss: sheets.toString(),
    baseUrl: globalThis.BASE_URL,
    rawBaseUrl: globalThis.RAW_BASE_URL,
  });
  ctx.body += app;

  ctx.body += footerTemplate({
    scriptTags: extractor.getScriptTags(),
  });
};
