import { createRouter as createReactRouter } from '@tanstack/react-router';

import { ClientStorage, ServerStorage } from '@/client/Common/Storage';
import { DefaultCatchBoundary } from '@/client/DefaultCatchBoundary';
import { parse, stringify } from '@/devalue';
import { CookiesProvider } from 'react-cookie';
import { BrowserRouter, StaticRouter } from 'react-router';
import { routeTree } from './routeTree.gen';

export function createRouter(request?: Request) {
	let ReactRouterOld: FCC;
	const storage = request
		? new ServerStorage(request.headers.get('cookies'))
		: new ClientStorage();

	if (request) {
		const url = new URL(request.url);
		ReactRouterOld = ({ children }) => (
			<StaticRouter location={url.href.replace(url.origin, '')}>
				{children}
			</StaticRouter>
		);
	} else {
		ReactRouterOld = ({ children }) => (
			<BrowserRouter>{children}</BrowserRouter>
		);
	}

	const Wrap: FCC = ({ children }) => (
		<ReactRouterOld>
			<CookiesProvider cookies={storage}>{children}</CookiesProvider>
		</ReactRouterOld>
	);

	return createReactRouter({
		defaultPreload: 'render',
		routeTree,
		// @ts-expect-error
		Wrap,
		// @ts-expect-error ??? wrong typing?
		transformer: {
			parse,
			stringify: stringify,
		},
		defaultErrorComponent: DefaultCatchBoundary,
	});
}

declare module '@tanstack/react-router' {
	interface Register {
		router: ReturnType<typeof createRouter>;
	}
}
