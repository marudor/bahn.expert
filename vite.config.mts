import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
	plugins: [
		tsconfigPaths(),
		TanStackRouterVite(),
		react({
			jsxImportSource: '@emotion/react',
			plugins: [['@swc/plugin-emotion', {}]],
		}),
	],
});
