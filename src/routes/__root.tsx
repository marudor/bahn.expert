import { HeaderTags } from '@/client/Common/Components/HeaderTags';
import { Navigation } from '@/client/Common/Components/Navigation';
import { ThemeHeaderTags } from '@/client/Common/Components/ThemeHeaderTags';
import { CommonConfigProvider } from '@/client/Common/provider/CommonConfigProvider';
import { HeaderTagProvider } from '@/client/Common/provider/HeaderTagProvider';
import { GlobalCSS } from '@/client/GlobalCSS';
import { PolitikPopup } from '@/client/PolitikPopup';
import { RoutingProvider } from '@/client/Routing/provider/RoutingProvider';
import type { TRPCQueryUtilsType } from '@/router';
import { NoSsr } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
// @ts-expect-error ESM fuckup
import { deDE } from '@mui/x-date-pickers/node/locales/deDE';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import {
	type AnyRouteMatch,
	Outlet,
	ScrollRestoration,
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
	baseUrl: string;
	trpcUtils: TRPCQueryUtilsType;
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
		const image = `https://${ctx.match.context.baseUrl}/android-chrome-384x384.png`;
		return {
			meta: [
				{
					name: 'og:type',
					content: 'website',
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
				<ScrollRestoration />
				{chaosSocialAnchor}
				<LocalizationProvider
					dateAdapter={AdapterDateFns}
					adapterLocale={deLocale}
					localeText={customDeLocaleText}
				>
					<GlobalCSS />
					<HeaderTagProvider>
						<ThemeHeaderTags />
						<CommonConfigProvider>
							<Navigation>
								<RoutingProvider>
									<PolitikPopup />
									<Outlet />
									<HeaderTags />
								</RoutingProvider>
							</Navigation>
						</CommonConfigProvider>
					</HeaderTagProvider>
				</LocalizationProvider>
				{!globalThis.Cypress && (
					<NoSsr>
						<RouterDevtools />
						<ReactQueryDevtools />
					</NoSsr>
				)}
				<Scripts />
			</body>
		</html>
	);
}

export const RootRoute = Route;
