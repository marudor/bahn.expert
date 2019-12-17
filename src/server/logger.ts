import { Context } from 'koa';
import { Timber } from '@timberio/node';
import { TimberStream } from '@timberio/bunyan';
import bunyan, { INFO } from 'bunyan';
import bunyanFormat from 'bunyan-format';
import bunyanLoggly from 'bunyan-loggly';
import bunyanMiddleware from 'koa-bunyan-logger';

const config = {
  level: INFO,
  name: 'application',
  origin: 'BahnhofsAbfahrten',
  streams: [
    {
      stream: new bunyanFormat({
        outputMode: 'short',
      }),
    },
  ],
  serializers: bunyan.stdSerializers,
};

const token = process.env.LOGGLY_TOKEN;
const subdomain = process.env.LOGGLY_SUBDOMAIN;

// istanbul ignore next
if (process.env.NODE_ENV === 'production' && token && subdomain) {
  // eslint-disable-next-line no-console
  console.log('Using loggly to log');
  config.streams.push({
    // @ts-ignore
    stream: new bunyanLoggly({
      token,
      subdomain,
    }),
    type: 'raw',
  });
}

const timberSource = process.env.TIMBER_SOURCE;
const timberToken = process.env.TIMBER_TOKEN;

if (process.env.NODE_ENV === 'production' && timberSource && timberToken) {
  // eslint-disable-next-line no-console
  console.log('Using Timber to log');
  config.streams.push({
    // @ts-ignore
    stream: new TimberStream(new Timber(timberToken, timberSource)),
  });
}

export const logger = bunyan.createLogger(config);
export const middlewares = [bunyanMiddleware(logger)];

// istanbul ignore next
if (process.env.NODE_ENV !== 'test') {
  middlewares.push(bunyanMiddleware.requestIdContext());
  middlewares.push(
    bunyanMiddleware.requestLogger({
      updateLogFields(this: Context, data) {
        data.req.headers = {};
        // @ts-ignore
        if (data.res) {
          // @ts-ignore
          // eslint-disable-next-line no-underscore-dangle
          data.res._header = data.res._header
            ?.replace(/Content-(Type|Length): .*\r?\n/g, '')
            .replace(/Connection: .*\r?\n/g, '')
            .replace(/Date: .*\r?\n/g, '')
            .replace(/Last-Modified: .*\r?\n/g, '')
            .replace(/Cache-Control: .*\r?\n/g, '')
            .trim();
        }

        return data;
      },
    })
  );
}
