import bunyan, { INFO } from 'bunyan';
import bunyanFormat from 'bunyan-format';
import bunyanLoggly from 'bunyan-loggly';
import bunyanMiddleware from 'koa-bunyan-logger';
import config from 'server/config';

const logglyConfig = {
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

// istanbul ignore next
if (process.env.NODE_ENV === 'production' && config.loggly) {
  // eslint-disable-next-line
  console.log('Using loggly to log');
  logglyConfig.streams.push({
    // @ts-ignore
    stream: new bunyanLoggly(config.loggly),
    type: 'raw',
  });
}

export const logger = bunyan.createLogger(logglyConfig);
export const middlewares = [bunyanMiddleware(logger)];
if (process.env.NODE_ENV !== 'test') {
  middlewares.push(bunyanMiddleware.requestLogger());
}
