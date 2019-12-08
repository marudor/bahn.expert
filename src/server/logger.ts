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

export const logger = bunyan.createLogger(config);
export const middlewares = [bunyanMiddleware(logger)];
if (process.env.NODE_ENV !== 'test') {
  middlewares.push(bunyanMiddleware.requestLogger());
}
