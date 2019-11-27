import Koa from 'koa';
import KoaStatic from 'koa-static';
import path from 'path';

const docsPort = Number.parseInt(process.env.DOCS_PORT || '9023', 10);
const app = new Koa();

app.use(KoaStatic(path.resolve('docs')));

app.listen(docsPort);

export default app;
