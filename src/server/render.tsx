/* eslint-disable unicorn/prefer-module */
import { ChunkExtractor } from '@loadable/server';
import { renderToString } from 'react-dom/server';
import { sanitizeStorage } from '@/server/sanitizeStorage';
import { ServerBaseComponent } from '@/client/ServerBaseComponent';
import createEmotionCache from '@emotion/cache';
import createEmotionServer from '@emotion/server/create-instance';
import ejs from 'ejs';
import fs from 'node:fs';
import path from 'node:path';
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
  const emotionCache = createEmotionCache({ key: 'css', prepend: true });
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { extractCriticalToChunks, constructStyleTagsFromChunks } =
    createEmotionServer(emotionCache);
  const extractor = new ChunkExtractor({ stats: ctx.loadableStats });
  const selectedDetail = ctx.query.selectedDetail;

  if (selectedDetail && typeof selectedDetail == 'string') {
    ctx.request.storage.set('selectedDetail', selectedDetail);
  }

  sanitizeStorage(ctx.request.storage);

  const headTags: any = [];
  const App = extractor.collectChunks(
    <ServerBaseComponent
      headTags={headTags}
      url={ctx.url}
      storage={ctx.request.storage}
      emotionCache={emotionCache}
    />,
  );

  // eslint-disable-next-line testing-library/render-result-naming-convention
  const app = renderToString(App);
  const emotionStyles = extractCriticalToChunks(app);
  const emotionStyleTags = constructStyleTagsFromChunks(emotionStyles);
  ctx.body = headerTemplate({
    withStats: process.env.NODE_ENV === 'production' && !process.env.TEST_RUN,
    header: renderToString(headTags),
    cssTags: extractor.getStyleTags(),
    linkTags: extractor.getLinkTags(),
    imprint: JSON.stringify(globalThis.IMPRINT),
    emotionCss: emotionStyleTags,
    baseUrl: globalThis.BASE_URL,
    rawBaseUrl: globalThis.RAW_BASE_URL,
  });
  // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
  ctx.body += app;

  // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
  ctx.body += footerTemplate({
    scriptTags: extractor.getScriptTags(),
  });
};
