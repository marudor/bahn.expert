import { SHARE_ENV, Worker } from 'worker_threads';
import cookie from 'cookie';
import koaLogger from './koaLogger';
import path from 'path';
import pino from 'pino';
import serializers from 'pino-std-serializers';

const createWriteOptions = () => {
  if (process.env.NODE_ENV === 'test') {
    return {
      write() {
        // No logging in tests
      },
    };
  }

  const writeWorker = new Worker(
    path.resolve(__dirname, 'logWriteThread.cjs'),
    {
      env: SHARE_ENV,
    },
  );

  return {
    write: (msg: string) => {
      writeWorker.postMessage(msg);
    },
  };
};

export const logger = pino(
  {
    redact: {
      paths: ['req.remoteAddress', 'req.remotePort', 'res.headers'],
      remove: true,
    },
    name: 'BahnhofsAbfahrten',
    level: process.env.NODE_ENV === 'production' ? 'info' : 'trace',
    serializers: {
      req: serializers.wrapRequestSerializer((req) => {
        try {
          const cookies = cookie.parse(req.headers.cookie);

          req.headers = {
            // @ts-expect-error typing wrong
            cookie: cookies,
            'user-agent': req.headers['user-agent'],
            referer: req.headers.referer,
          };
        } catch {
          // if we can't parse cookies keep them
        }

        return req;
      }),
      res: serializers.res,
      err: serializers.wrapErrorSerializer((err) => {
        try {
          delete err.config?.httpsAgent;
        } catch {
          // we ignore errors
        }
        return err;
      }),
    },
  },
  createWriteOptions(),
);

export const middlewares = [koaLogger(logger)];
