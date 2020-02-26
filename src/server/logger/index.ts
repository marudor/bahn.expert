import { SHARE_ENV, Worker } from 'worker_threads';
import cookie from 'cookie';
import koaLogger from './koaLogger';
import path from 'path';
import pino from 'pino';
import serializers from 'pino-std-serializers';

declare module 'worker_threads' {
  export const SHARE_ENV: Symbol;
  interface WorkerOptions {
    env: Object | Symbol;
  }
}

const writeWorker = new Worker(path.resolve(__dirname, 'logWriteThread.js'), {
  env: SHARE_ENV,
});

const writeOptions = {
  write(msg: string) {
    writeWorker.postMessage(msg);
  },
};

if (process.env.NODE_ENV === 'test') {
  writeWorker.unref();
}

export const logger = pino(
  {
    redact: {
      paths: [
        'req.remoteAddress',
        'req.remotePort',
        'res.headers',
        'res.statusCode',
      ],
      remove: true,
    },
    name: 'BahnhofsAbfahrten',
    serializers: {
      req: serializers.wrapRequestSerializer(req => {
        try {
          const cookies = cookie.parse(req.headers.cookie);

          req.headers = {
            // @ts-ignore
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
      err: serializers.err,
    },
  },
  writeOptions
);

export const middlewares = [koaLogger(logger)];
