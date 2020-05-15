// istanbul ignore file
import childProcess from 'child_process';
import chokidar from 'chokidar';
import path from 'path';
import webpack from 'webpack';
import webpackConfig from '../../../webpack.config';
import webpackHotclient from 'webpack-hot-client';
import webpackMiddleware from 'webpack-dev-middleware';
import type { Server } from 'https';
import type Koa from 'koa';

// @ts-ignore
const compiler: any = webpack(webpackConfig);

module.exports = function webpackDev(koa: Koa, server: undefined | Server) {
  // Do "hot-reloading" of react stuff on the server
  // Throw away the cached client modules and let them be re-required next time
  // see https://github.com/glenjamin/ultimate-hot-reloading-example
  compiler.hooks.done.tap('CacheBusting', () => {
    // eslint-disable-next-line no-console
    console.log('Clearing webpack module cache from server');
    Object.keys(require.cache).forEach((id) => {
      if (id.match(/packages\/client/)) {
        delete require.cache[id];
      }
    });
    delete require.cache[path.resolve('packages/server/render.tsx')];
  });
  const watcher = chokidar.watch(path.resolve('./packages/server/**'));

  watcher.on('change', (file) => {
    if (file.includes('packages/server/API/controller/')) {
      console.log('Rebuilding Routs & doc');
      childProcess.exec('yarn doc:build');
    }
    Object.keys(require.cache).forEach((id) => {
      if (id.match(/packages\/server/)) {
        delete require.cache[id];
      }
    });
  });

  return new Promise((resolve) => {
    const client = webpackHotclient(compiler, {
      https: true,
      host: 'local.marudor.de',
      server,
    });
    client.server.on('listening', () => {
      const middleware = webpackMiddleware(compiler, {
        serverSideRender: true,
        publicPath: '/',
      });

      koa.use((ctx, next) => {
        return new Promise((resolve, reject) => {
          middleware(
            ctx.req,
            {
              // @ts-ignore
              send: (content: any) => {
                ctx.body = content;
                resolve();
              },
              // @ts-ignore
              get: ctx.res.getHeader.bind(ctx.res),
              getHeader: ctx.res.getHeader.bind(ctx.res),
              set: ctx.res.setHeader.bind(ctx.res),
              setHeader: ctx.res.setHeader.bind(ctx.res),
              locals: ctx.state,
            },
            (err) => {
              if (err) reject(err);
              else {
                resolve(next());
              }
            }
          );
        });
      });
      resolve();
    });
  });
};
