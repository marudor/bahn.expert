// istanbul ignore file
import { Server } from 'https';
import childProcess from 'child_process';
import chokidar from 'chokidar';
import Koa from 'koa';
import koaWebpack from 'koa-webpack';
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
    Object.keys(require.cache).forEach(id => {
      if (id.match(/src\/server/)) {
        delete require.cache[id];
      }
    });
    // Magic to make webpack full reload the page
    // whm.publish({ action: 'sync', errors: [], warnings: [], hash: Math.random() });
  });

  const routesWatcher = chokidar.watch(path.resolve('./src/server/API/**'));

  routesWatcher.on('change', file => {
    if (file.endsWith('routes.ts')) return;
    childProcess.exec('yarn doc:build');
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
  });
};
