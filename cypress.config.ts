import { defineConfig } from 'cypress';

export default defineConfig({
  projectId: 'ucnqdt',
  numTestsKeptInMemory: 0,
  video: false,
  requestTimeout: 10000,
  retries: {
    runMode: 2,
    openMode: 0,
  },
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./cypress/plugins')(on, config);
    },
    baseUrl: 'http://localhost:9042',
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
  },
});
