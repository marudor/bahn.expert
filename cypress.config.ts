import { defineConfig } from 'cypress';
import * as vitePreprocessor from 'cypress-vite';

export default defineConfig({
	projectId: 'ucnqdt',
	numTestsKeptInMemory: 0,
	video: false,
	requestTimeout: 10000,
	defaultCommandTimeout: 10000,

	retries: {
		runMode: 2,
		openMode: 0,
	},

	e2e: {
		excludeSpecPattern: process.env.CI ? ['cypress/e2e/all.test.ts'] : [],
		// We've imported your old cypress plugins here.
		// You may want to clean this up later by importing these.
		setupNodeEvents(on, _config) {
			// @ts-expect-error ???
			on('file:preprocessor', vitePreprocessor());
		},
		baseUrl: 'http://localhost:9042',
		specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
	},

	component: {
		supportFile: './cypress/support/component.tsx',
		devServer: {
			framework: 'react',
			bundler: 'vite',
		},
	},
});
