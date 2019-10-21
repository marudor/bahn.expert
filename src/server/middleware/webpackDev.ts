// istanbul ignore file
import { Server } from 'https';
import chokidar from 'chokidar';
import Koa from 'koa';
import koaWebpack from 'koa-webpack';
// @ts-ignore
import launchEditor from 'react-dev-utils/launchEditor';
// @ts-ignore
import launchEditorEndpoint from 'react-dev-utils/launchEditorEndpoint';
import path from 'path';
import webpack from 'webpack';
// @ts-ignore
import webpackConfig from '../../../webpack.config';

const compiler: any = webpack(webpackConfig);

module.exports = function webpackDev(koa: Koa, server: undefined | Server) {
  // Do "hot-reloading" of react stuff on the server
  // Throw away the cached client modules and let them be re-required next time
  // see https://github.com/glenjamin/ultimate-hot-reloading-example
  compiler.hooks.done.tap('CacheBusting', () => {
    // eslint-disable-next-line no-console
    console.log('Clearing webpack module cache from server');
    Object.keys(require.cache).forEach(id => {
      if (id.match(/src\/client/)) {
        delete require.cache[id];
      }
    });
    delete require.cache[path.resolve('src/server/render.tsx')];
  });
  const watcher = chokidar.watch(path.resolve('./src/server/**'));

  watcher.on('change', () => {
    // eslint-disable-next-line no-console
    Object.keys(require.cache).forEach(id => {
      if (id.match(/src\/server/)) {
        delete require.cache[id];
      }
    });
    // Magic to make webpack full reload the page
    // whm.publish({ action: 'sync', errors: [], warnings: [], hash: Math.random() });
  });

  return koaWebpack({
    compiler,
    devMiddleware: {
      publicPath: '/',
      serverSideRender: true,
    },
    hotClient: process.env.CYPRESS
      ? false
      : { https: true, host: 'local.marudor.de', server },
  }).then(middleware => {
    koa.use(middleware);
    koa.use((ctx, next) => {
      if (ctx.url.startsWith(launchEditorEndpoint) && ctx.query.fileName) {
        const lineNumber = parseInt(ctx.query.lineNumber, 10) || 1;
        const colNumber = parseInt(ctx.query.colNumber, 10) || 1;
        const fileName = ctx.query.fileName.startsWith('webpack:///')
          ? ctx.query.fileName.substr(11)
          : ctx.query.fileName;

        launchEditor(path.resolve(fileName), lineNumber, colNumber);
        ctx.status = 200;
      } else {
        return next();
      }
    });
  });
};
