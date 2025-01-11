import { Navigation } from '@/client/Common/Components/Navigation';
import { ThemeHeaderTags } from '@/client/Common/Components/ThemeHeaderTags';
import { CommonConfigProvider } from '@/client/Common/provider/CommonConfigProvider';
import { HeaderTagProvider } from '@/client/Common/provider/HeaderTagProvider';
import { GlobalCSS } from '@/client/GlobalCSS';
import { RPCProvider } from '@/client/RPC';
import { RoutingProvider } from '@/client/Routing/provider/RoutingProvider';
import { theme } from '@/client/Themes';
import { ThemeProvider } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// @ts-expect-error ESM fuckup
import { deDE } from '@mui/x-date-pickers/node/locales/deDE';
import {
	type AnyRouteMatch,
	Outlet,
	createRootRouteWithContext,
} from '@tanstack/react-router';
import { Meta, Scripts } from '@tanstack/start';
import { de as deLocale } from 'date-fns/locale/de';
import { z } from 'zod';

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

const scripts: AnyRouteMatch['scripts'] = [
	{
		children: `
			window.DISRUPTION=${JSON.stringify(globalThis.DISRUPTION)};
			var themeMode = localStorage.getItem('mui-mode');
			if (!themeMode || themeMode === 'system') {
				themeMode = 'dark';
				localStorage.setItem('mui-mode', 'dark');
			}
			if (themeMode && document.documentElement) {
				document.documentElement.setAttribute('class', themeMode);
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

let plausibleScript: (typeof scripts)[number] | undefined;

export const Route = createRootRouteWithContext<{
	fullUrl: string;
	baseUrl: string;
}>()({
	validateSearch: z.object({
		noHeader: z.boolean().optional(),
	}),
	head: (ctx) => {
		if (!import.meta.env.DEV) {
			if (!plausibleScript) {
				plausibleScript = {
					async: true,
					defer: true,
					// @ts-expect-error custom
					'data-api': `https://${ctx.match.context.baseUrl}/api/event`,
					'data-domain': ctx.match.context.baseUrl,
					src: `https://${ctx.match.context.baseUrl}/js/script.js`,
				};
				scripts.push(plausibleScript);
			}
		}
		const fullUrl = ctx.match.context.fullUrl;
		const image = `https://${ctx.match.context.baseUrl}/android-chrome-384x384.png`;
		return {
			meta: [
				{
					name: 'og:type',
					content: 'website',
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
					content: 'initial-scale=1, width=device-width',
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
		<html className="dark" suppressHydrationWarning lang="de">
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
										<RoutingProvider>
											<Outlet />
										</RoutingProvider>
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
