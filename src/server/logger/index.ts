import { SHARE_ENV, Worker } from 'worker_threads';
import cookie from 'cookie';
import koaLogger from './koaLogger';
import path from 'path';
import pino from 'pino';
import serializers from 'pino-std-serializers';

const writeWorker = new Worker(path.resolve(__dirname, 'logWriteThread.js'), {
  env: SHARE_ENV,
});

const IS_TEST = process.env.NODE_ENV === 'test';

const writeOptions = {
  write: IS_TEST
    ? () => {}
    : (msg: string) => {
        writeWorker.postMessage(msg);
      },
};

if (IS_TEST) {
  writeWorker.unref();
}

export const logger = pino(
  {
    // @ts-expect-error
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
      req: serializers.wrapRequestSerializer((req) => {
        try {
          const cookies = cookie.parse(req.headers.cookie);

          req.headers = {
            // @ts-expect-error
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
