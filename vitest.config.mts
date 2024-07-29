import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [tsconfigPaths()],
	test: {
		environment: 'node',
		setupFiles: ['./src/server/__tests__/setup.ts'],
		env: {
			TZ: 'UTC',
			IRIS_URL: '',
		},
	},
});
