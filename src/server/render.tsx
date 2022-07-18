import { abfahrtenConfigSanitize, commonConfigSanitize } from 'client/util';
import { ChunkExtractor } from '@loadable/server';
import { renderToString } from 'react-dom/server';
import { sanitizeStorage } from 'server/sanitizeStorage';
import { ServerBaseComponent } from 'client/ServerBaseComponent';
import createEmotionCache from '@emotion/cache';
import createEmotionServer from '@emotion/server/create-instance';
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
  const emotionCache = createEmotionCache({
    key: 'css',
  });
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { extractCriticalToChunks, constructStyleTagsFromChunks } =
    createEmotionServer(emotionCache);
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
  const App = extractor.collectChunks(
    <ServerBaseComponent
      helmetContext={context}
      url={ctx.url}
      storage={ctx.request.storage}
      emotionCache={emotionCache}
    />,
  );

  // eslint-disable-next-line testing-library/render-result-naming-convention
  const app = renderToString(App);
  const emotionChunks = extractCriticalToChunks(app);
  const emotionCss = constructStyleTagsFromChunks(emotionChunks);
  ctx.body = headerTemplate({
    withStats: process.env.NODE_ENV === 'production',
    header: context.helmet,
    cssTags: extractor.getStyleTags(),
    linkTags: extractor.getLinkTags(),
    configOverride: JSON.stringify(globalThis.configOverride),
    imprint: JSON.stringify(globalThis.IMPRINT),
    emotionCss,
    baseUrl: globalThis.BASE_URL,
    rawBaseUrl: globalThis.RAW_BASE_URL,
  });
  ctx.body += app;

  ctx.body += footerTemplate({
    scriptTags: extractor.getScriptTags(),
  });
};
