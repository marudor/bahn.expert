import { ClientStorage } from '@/client/Common/Storage';
import { loadableReady } from '@loadable/component';
import Axios from 'axios';
import qs from 'qs';
import type { ComponentType } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { HeadProvider } from 'react-head';
import { BrowserRouter } from 'react-router';
import { ThemeWrap } from './ThemeWrap';
// 25s timeout
Axios.defaults.timeout = 25000;
import {} from '@/client/RPC';
import { ThemeProvider } from '@/client/Themes/Provider';
import {} from '@tanstack/react-query';
import { CookiesProvider } from 'react-cookie';

const isoDateRegex =
	/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}\.\d*)(?:Z|([+-])([\d:|]*))?$/;
Axios.defaults.transformResponse = [
	(data) => {
		if (typeof data === 'string') {
			try {
				return JSON.parse(data, (_key, value) => {
					if (typeof value === 'string' && isoDateRegex.test(value)) {
						return new Date(value);
					}
					return value;
				});
			} catch {
				// Ignoring
			}
		}
		return data;
	},
];
Axios.defaults.paramsSerializer = {
	serialize: (p) => qs.stringify(p, { arrayFormat: 'repeat' }),
};

const storage = new ClientStorage();

const renderApp = (App: ComponentType) => (
	<HeadProvider>
		<BrowserRouter>
			<CookiesProvider cookies={storage}>
				<ThemeProvider>
					<App />
				</ThemeProvider>
			</CookiesProvider>
		</BrowserRouter>
	</HeadProvider>
);

const container = document.getElementById('app')!;

let root: ReturnType<typeof hydrateRoot>;

void loadableReady(() => {
	root = hydrateRoot(container, renderApp(ThemeWrap));
});

// @ts-expect-error hot not typed
if (module.hot) {
	// @ts-expect-error hot not typed
	module.hot.accept('./ThemeWrap', () => {
		const App = require('./ThemeWrap').default;

		if (root) {
			root.render(renderApp(App));
		}
	});
}
