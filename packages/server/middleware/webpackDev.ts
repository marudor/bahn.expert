// istanbul ignore file
import childProcess from 'child_process';
import chokidar from 'chokidar';
import path from 'path';
import webpack from 'webpack';
import webpackConfig from '../../../webpack.config';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackMiddleware from 'webpack-dev-middleware';
import type Koa from 'koa';

// @ts-expect-error typing wrong
const compiler: any = webpack(webpackConfig);
const clientRegexp = /packages\/client/;
const serverRegexp = /packages\/(?!client)/;
export default function webpackDev(koa: Koa): Promise<unknown> {
  // Do "hot-reloading" of react stuff on the server
  // Throw away the cached client modules and let them be re-required next time
  // see https://github.com/glenjamin/ultimate-hot-reloading-example
  compiler.hooks.done.tap('CacheBusting', () => {
    // eslint-disable-next-line no-console
    console.log('Clearing webpack module cache from server');
    Object.keys(require.cache).forEach((id) => {
      if (clientRegexp.exec(id)) {
        delete require.cache[id];
      }
    });
    delete require.cache[path.resolve('packages/server/render.tsx')];
  });
  const watcher = chokidar.watch(path.resolve('./packages/**'));

  watcher.on('change', (file) => {
    if (file.includes('packages/client')) return;
    if (file.includes('packages/server/API/controller/')) {
      // eslint-disable-next-line no-console
      console.log('Rebuilding Routes & doc');
      childProcess.exec('yarn doc:build', (err, _, stderr) => {
        if (err) {
          // eslint-disable-next-line no-console
          console.error(stderr);
        } else {
          // eslint-disable-next-line no-console
          console.log('Done rebuilding');
        }
      });
    }
    Object.keys(require.cache).forEach((id) => {
      if (serverRegexp.exec(id)) {
        delete require.cache[id];
      }
    });
  });

  return new Promise<void>((resolve) => {
    const middleware = webpackMiddleware(compiler, {
      serverSideRender: true,
      publicPath: '/',
    });
    const hotMiddleware = webpackHotMiddleware(compiler);

    koa.use((ctx, next) => {
      return new Promise((resolve, reject) => {
        hotMiddleware(ctx.req, ctx.res, (err) => {
          if (err) reject(err);
          else resolve(next());
        });
      });
    });

    koa.use((ctx, next) => {
      return new Promise<void>((resolve, reject) => {
        middleware(
          ctx.req,
          {
            // @ts-expect-error ???
            send: (content: any) => {
              ctx.body = content;
              resolve();
            },
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
          },
        );
      });
    });
    resolve();
  });
}
