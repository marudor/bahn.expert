import { Outlet, createRootRoute } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { Meta, Scripts } from '@tanstack/start';

export const Route = createRootRoute({
	head: (ctx) => {
		// TODO: verify if this works for non catchall
		// @ts-expect-error doesnt like _splat usage
		const fullUrl = `${globalThis.BASE_URL}${ctx.match.fullPath}${ctx.params._splat}`;
		const image = `${globalThis.BASE_URL}/android-chrome-384x384.png`;
		return {
			meta: [
				{
					name: 'og:type',
					content: 'webiste',
				},
				{
					name: 'og:url',
					content: fullUrl,
				},
				{
					name: 'og:locale',
					content: 'de_DE',
				},
				{
					name: 'og:image',
					content: image,
				},

				{
					charSet: 'UTF-8',
				},
				{
					name: 'viewport',
					content:
						'initial-scale=1, minimum-scale=1, width=device-width, viewport-fit=contain',
				},
				{
					name: 'robots',
					content: 'all',
				},
				{
					name: 'mobile-web-app-capable',
					content: 'yes',
				},
				{
					name: 'mobile-web-app-status-bar-style',
					content: 'default',
				},
			],
			links: [
				{
					'data-testid': 'canonicalLink',
					rel: 'canonical',
					href: fullUrl,
				},
				{
					rel: 'stylesheet',
					href: '/roboto.css',
				},
				{
					rel: 'apple-touch-icon',
					sizes: '180x180',
					href: '/apple-touch-icon.png',
				},
				{
					rel: 'mask-icon',
					href: '/safari-pinned.tab.svg',
					color: '#000000',
				},
				{
					rel: 'shortcut icon',
					href: '/favicon.svg',
				},
			],
			scripts: [
				{
					children: `
							window.BASE_URL='${globalThis.BASE_URL}';
							window.DISRUPTION='${globalThis.DISRUPTION}';
						`,
				},
				{
					async: true,
					defer: true,
					'data-api': `https://${globalThis.RAW_BASE_URL}/api/event`,
					'data-domain': globalThis.RAW_BASE_URL,
					src: `https://${globalThis.RAW_BASE_URL}/js/script.js`,
				},
				{
					type: 'module',
					children: `
						let themeMode = localStorage.getItem('mui-mode');
						if (!themeMode || themeMode === 'system') {
							themeMode = 'dark';
							localStorage.setItem('mui-mode', 'dark');
						}
						if (themeMode && document.body.parentElement) {
							document.body.parentElement.setAttribute('class', themeMode);
						}
						`,
				},
				{
					type: 'module',
					children: `import RefreshRuntime from "/@react-refresh"
			RefreshRuntime.injectIntoGlobalHook(window)
			window.$RefreshReg$ = () => {}
			window.$RefreshSig$ = () => (type) => type
			window.__vite_plugin_react_preamble_installed__ = true`,
				},
				{
					type: 'module',
					src: '/@vite/client',
				},
				{
					type: 'module',
					src: '/src/client/index.tsx',
				},
			],
		};
	},
	component: RootComponent,
});

const chaosSocialAnchor = (
	// biome-ignore lint/a11y/useAnchorContent: <explanation>
	<a
		rel="me"
		style={{
			display: 'none',
		}}
		href="https://chaos.social/@marudor"
	/>
);

function RootComponent() {
	return (
		<html suppressHydrationWarning lang="de">
			<head>
				<Meta />
			</head>
			<body>
				{chaosSocialAnchor}
				<Outlet />
				{!globalThis.Cypress && (
					<TanStackRouterDevtools position="bottom-left" />
				)}
				<Scripts />
			</body>
		</html>
	);
}
