import { defineConfig } from '@tanstack/start/config';
import react from '@vitejs/plugin-react';
import tsConfigPaths from 'vite-tsconfig-paths';

const buildNoExternal = [
	'@mui/icons-material',
	'@mui/x-date-pickers',
	'maplibre-gl',
	'@mui/system',
	'@mui/material',
	'libxmljs2',
];

const devNoExternal = ['@mui/icons-material'];

const vinxiConfig = defineConfig({
	react: {
		jsxImportSource: '@emotion/react',
	},
	vite: {
		plugins: [tsConfigPaths()],
		esbuild: {
			legalComments: 'none',
		},
		ssr: {
			target: 'node',
			noExternal:
				process.env.NODE_ENV === 'production' ? buildNoExternal : devNoExternal,
		},
	},
	routers: {
		client: {
			entry: './src/client/index.tsx',
		},
		ssr: {
			entry: './src/server/entry.tsx',
			vite: {
				plugins: [
					react({
						jsxImportSource: '@emotion/react',
					}),
				],
			},
		},
	},
	server: {
		compressPublicAssets: {
			brotli: true,
			gzip: true,
		},
		publicAssets: [
			{
				dir: 'public',
				maxAge: 60 * 60 * 24 * 360,
			},
		],
		plugins: ['./src/server/admin/nitroPlugin.ts'],
		commonJS: {
			include: ['dom-helpers', 'maplibre-gl'],
		},
		experimental: {
			legacyExternals: true,
		},
	},
	tsr: {
		semicolons: true,
		routesDirectory: './src/routes',
		generatedRouteTree: './src/routeTree.gen.ts',
		autoCodeSplitting: false,
		pathParamsAllowedCharacters: [':'],
	},
});

vinxiConfig.addRouter({
	name: 'trpc',
	type: 'http',
	base: '/rpc',
	handler: './src/server/rpc/index.ts',
	plugins: () => [tsConfigPaths()],
});
vinxiConfig.addRouter({
	name: 'legacyApi',
	type: 'http',
	base: '/api',
	handler: './src/server/rpc/legacyApi.ts',
	plugins: () => [tsConfigPaths()],
});
vinxiConfig.addRouter({
	name: 'seo',
	type: 'http',
	handler: './src/server/seo/index.ts',
});

// Workaround to ensure SSR is last
const ssrRouter = vinxiConfig.getRouter('ssr');
vinxiConfig.config.routers = vinxiConfig.config.routers.filter(
	(r) => r.name !== 'ssr',
);
vinxiConfig.addRouter(ssrRouter);
vinxiConfig.config.routers.find((r) => r.name === 'ssr')!.outDir =
	ssrRouter.outDir;

export default vinxiConfig;
