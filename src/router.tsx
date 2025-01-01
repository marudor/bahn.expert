import { createRouter as createReactRouter } from '@tanstack/react-router';

import { ClientStorage, type StorageInterface } from '@/client/Common/Storage';
import { ThemeProvider } from '@/client/Themes/Provider';
import { parse, stringify } from '@/devalue';
import { CookiesProvider } from 'react-cookie';
import { BrowserRouter, StaticRouter } from 'react-router';
import { routeTree } from './routeTree.gen';

export function createRouter(storage?: StorageInterface, location?: string) {
	let ReactRouterOld: FCC;
	if (!storage) {
		// biome-ignore lint/style/noParameterAssign:
		storage = new ClientStorage();
	}
	if (location) {
		ReactRouterOld = ({ children }) => (
			<StaticRouter location={location}>{children}</StaticRouter>
		);
	} else {
		ReactRouterOld = ({ children }) => (
			<BrowserRouter>{children}</BrowserRouter>
		);
	}

	const Wrap: FCC = ({ children }) => (
		<ThemeProvider>
			<ReactRouterOld>
				<CookiesProvider cookies={storage}>{children}</CookiesProvider>
			</ReactRouterOld>
		</ThemeProvider>
	);

	return createReactRouter({
		routeTree,
		// @ts-expect-error
		Wrap,
		defaultPreload: 'intent',
		// @ts-expect-error ??? wrong typing?
		transformer: {
			parse,
			stringify: stringify,
		},
	});
}

declare module '@tanstack/react-router' {
	interface Register {
		router: ReturnType<typeof createRouter>;
	}
}
