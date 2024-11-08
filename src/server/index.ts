import { imprint } from './imprint';

globalThis.BASE_URL = `${
	process.env.NODE_ENV === 'production' && !process.env.TEST_RUN
		? 'https://'
		: 'http://'
}${process.env.BASE_URL || 'localhost:9042'}`;
globalThis.RAW_BASE_URL = process.env.BASE_URL || 'localhost:9042';
globalThis.IMPRINT = imprint;
globalThis.DISRUPTION = process.env.DISRUPTION;

import { logger } from './logger';

try {
  const server = require('./app').default();
  server.on('error', (error: Error) => {
    logger.error('Server error:', error);
  });
  logger.info(`Server started on port ${process.env.WEB_PORT || 9042}`);
} catch (error) {
  logger.error('Failed to start server:', error);
  process.exit(1);
}
