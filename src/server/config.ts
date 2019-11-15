export interface Config {
  port: number;
  environment: string;
  baseUrl: string;
  loggly?: {
    token: string;
    subdomain: string;
  };
  tagmanagerId?: string;
  sentryDSN?: string;
  wifi?: {
    url: string;
    user: string;
    pass: string;
  };
  stationOpenDataAuthKey?: string;
  timetableOpenDataAuthKey?: string;
  imprint: {
    name?: string;
    street?: string;
    town?: string;
  };
}

const config: Config = {
  port: 9042,
  baseUrl: 'http://localhost:9042',
  environment: 'development',
  imprint: {},
};

const configOverridePath = process.env.CONFIG_PATH || '../../config.local.js';

try {
  const overrideConfig = require(configOverridePath);

  Object.assign(config, overrideConfig);
} catch (e) {
  // eslint-disable-next-line no-console
  console.warn('No local config found, using default only', e);
}

export default config;
