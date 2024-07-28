import { imprint } from './imprint';

globalThis.BASE_URL = `${
	process.env.NODE_ENV === 'production' && !process.env.TEST_RUN
		? 'https://'
		: 'http://'
}${process.env.BASE_URL || 'localhost:9042'}`;
globalThis.RAW_BASE_URL = process.env.BASE_URL || 'localhost:9042';
globalThis.IMPRINT = imprint;

require('./app').default();
