// @flow
const webpack = require('webpack');
const webpackConfig = require('../../../webpack.config');
const chokidar = require('chokidar');
const path = require('path');
// $FlowFixMe
const compiler = webpack(webpackConfig);
const koaWebpack = require('koa-webpack');

module.exports = function webpackDev(koa: any) {
  // Do "hot-reloading" of react stuff on the server
  // Throw away the cached client modules and let them be re-required next time
  // see https://github.com/glenjamin/ultimate-hot-reloading-example
  // $FlowFixMe
  compiler.hooks.done.tap('CacheBusting', () => {
    // eslint-disable-next-line no-console
    console.log('Clearing webpack module cache from server');
    Object.keys(require.cache).forEach(id => {
      if (id.match(/src\/client/)) {
        delete require.cache[id];
      }
    });
    delete require.cache[path.resolve('src/server/render.js')];
  });

  const watcher = chokidar.watch(path.resolve('./src/server/**'));

  watcher.on('change', changedPath => {
    // eslint-disable-next-line no-console
    console.log(`${changedPath} changed`);
    delete require.cache[changedPath];
    // Magic to make webpack full reload the page
    // whm.publish({ action: 'sync', errors: [], warnings: [], hash: Math.random() });
    delete require.cache[path.resolve('src/server/Controller.js')];
  });

  return koaWebpack({ compiler, devMiddleware: { serverSideRender: true } }).then(middleware => {
    koa.use(middleware);
  });
};
