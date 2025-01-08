import { Navigation } from '@/client/Common/Components/Navigation';
import { ThemeHeaderTags } from '@/client/Common/Components/ThemeHeaderTags';
import { CommonConfigProvider } from '@/client/Common/provider/CommonConfigProvider';
import { HeaderTagProvider } from '@/client/Common/provider/HeaderTagProvider';
import { GlobalCSS } from '@/client/GlobalCSS';
import { RPCProvider } from '@/client/RPC';
import { theme } from '@/client/Themes';
import { ThemeProvider } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// @ts-expect-error ESM fuckup
import { deDE } from '@mui/x-date-pickers/node/locales/deDE';
import { Outlet, createRootRoute } from '@tanstack/react-router';
import { Meta, Scripts } from '@tanstack/start';
import { de as deLocale } from 'date-fns/locale/de';

const RouterDevtoolsConditional =
	process.env.NODE_ENV === 'production'
		? null
		: (await import('@tanstack/router-devtools')).TanStackRouterDevtools;

function RouterDevtools() {
	if (RouterDevtoolsConditional) {
		return <RouterDevtoolsConditional position="bottom-left" />;
	}
	return null;
}

const customDeLocaleText: typeof deDE.components.MuiLocalizationProvider.defaultProps.localeText =
	{
		...deDE.components.MuiLocalizationProvider.defaultProps.localeText,
		clearButtonLabel: 'Jetzt',
	};

const scripts = [
	{
		children: `
				window.DISRUPTION=${JSON.stringify(globalThis.DISRUPTION)};
			`,
	},
	{
		async: true,
		defer: true,
		'data-api': `https://${import.meta.env.VITE_BASE_URL}/api/event`,
		'data-domain': import.meta.env.VITE_BASE_URL,
		src: `https://${import.meta.env.VITE_BASE_URL}/js/script.js`,
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
];

if (import.meta.env.DEV) {
	scripts.push({
		type: 'module',
		children: `import RefreshRuntime from "/_build/@react-refresh";
RefreshRuntime.injectIntoGlobalHook(window)
window.$RefreshReg$ = () => {}
window.$RefreshSig$ = () => (type) => type`,
	});
}

export const Route = createRootRoute({
	head: (ctx) => {
		// TODO: verify if this works for non catchall
		// @ts-expect-error doesnt like _splat usage
		const fullUrl = `https://${import.meta.env.VITE_BASE_URL}${ctx.match.fullPath}${ctx.params._splat}`;
		const image = `https://${import.meta.env.VITE_BASE_URL}/android-chrome-384x384.png`;
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
			scripts,
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
				<RPCProvider>
					<ThemeProvider theme={theme}>
						<LocalizationProvider
							dateAdapter={AdapterDateFns}
							adapterLocale={deLocale}
							localeText={customDeLocaleText}
						>
							<GlobalCSS />
							<ThemeHeaderTags />
							<HeaderTagProvider>
								<CommonConfigProvider>
									<Navigation>
										<Outlet />
									</Navigation>
								</CommonConfigProvider>
							</HeaderTagProvider>
						</LocalizationProvider>
					</ThemeProvider>
				</RPCProvider>
				{!globalThis.Cypress && <RouterDevtools />}
				<Scripts />
			</body>
		</html>
	);
}
