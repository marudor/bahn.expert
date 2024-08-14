import './commands';
import { GlobalCSS } from '@/client/App';
import { Navigation } from '@/client/Common/Components/Navigation';
import type { CommonConfig } from '@/client/Common/config';
import { InnerCommonConfigProvider } from '@/client/Common/provider/CommonConfigProvider';
import { ThemeWrap } from '@/client/ThemeWrap';
import { theme } from '@/client/Themes';
import { StorageContext } from '@/client/useStorage';
import type { CssVarsTheme } from '@mui/material';
import { mount } from 'cypress/react18';
import type { ReactElement } from 'react';
import { HeadProvider } from 'react-head';
import Cookies from 'universal-cookie';
import '@percy/cypress';
import { ThemeProvider } from '@/client/Themes/Provider';
import { BrowserRouter } from 'react-router-dom';

const hexToRgb = (hex: string) => {
	const rValue = Number.parseInt(hex.slice(1, 3), 16);
	const gValue = Number.parseInt(hex.slice(3, 5), 16);
	const bValue = Number.parseInt(hex.slice(5), 16);
	return `rgb(${rValue}, ${gValue}, ${bValue})`;
};

const cssVarRegex = /var\((--[^),]*),?[^)]*\)/;
chai.use((chai, utils) => {
	utils.overwriteMethod(
		chai.Assertion.prototype,
		'css',
		// biome-ignore lint/complexity/noBannedTypes: monkeypatching
		(_super: Function) =>
			function (this: any, propertyName: string, value: string) {
				if (propertyName === 'color') {
					if (value.startsWith('var(--')) {
						const variableName = value.match(cssVarRegex)?.at(1);
						if (variableName) {
							const resolvedVariable = window
								.getComputedStyle(this._obj[0])
								.getPropertyValue(variableName);
							if (resolvedVariable) {
								// biome-ignore lint/style/noParameterAssign: monkeypatching
								value = resolvedVariable;
							}
						}
					}
					if (value.startsWith('#')) {
						Reflect.apply(_super, this, [propertyName, hexToRgb(value)]);
						return;
					}
				}
				// biome-ignore lint/style/noArguments: monkeypatching
				Reflect.apply(_super, this, arguments);
			},
	);
});

interface ContextWithOptions<V = any> extends React.Context<V> {
	initialState?: V;
}
interface ProviderWithOptions<
	out C extends React.FunctionComponent = React.FunctionComponent<any>,
> {
	Provider: C;
	// FIXME: should be Props of C
	initialState?: any;
}
interface Options {
	withNavigation?: boolean;
	provider?: ProviderWithOptions[];
	context?: ContextWithOptions[];
	commonConfig?: Partial<CommonConfig>;
}

declare global {
	namespace Cypress {
		interface Chainable {
			mount: (
				component: ReactElement,
				options?: Options,
			) => ReturnType<typeof mount>;
			getTheme: () => Chainable<CssVarsTheme>;
		}
	}

	namespace globalThis {
		var parseJson: <T = unknown>(json: string) => T;
	}
}

const isoDateRegex =
	/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}\.\d*)(?:Z|([+-])([\d:|]*))?$/;

globalThis.parseJson = (json: string) => {
	try {
		return JSON.parse(json, (_key, value) => {
			if (typeof value === 'string' && isoDateRegex.test(value)) {
				return new Date(value);
			}
			return value;
		});
	} catch {
		return json;
		// Ignoring
	}
};

Cypress.Commands.add('getTheme', () => cy.window().then(() => theme));

Cypress.Commands.add(
	'mount',
	(
		component: ReactElement,
		{ withNavigation, context, commonConfig, provider }: Options = {},
	) => {
		const cookies = new Cookies();
		cookies.set('seenCoachSequence', true);
		let result = (
			<>
				<GlobalCSS />
				{component}
			</>
		);

		if (withNavigation) {
			result = <Navigation>{result}</Navigation>;
		}

		if (context) {
			for (const c of context) {
				result = <c.Provider value={c.initialState}>{result}</c.Provider>;
			}
		}

		if (provider) {
			for (const { Provider, initialState } of provider) {
				result = <Provider {...initialState}>{result}</Provider>;
			}
		}

		const mergedCommonConfig: CommonConfig = {
			showUIC: false,
			fahrzeugGruppe: false,
			autoUpdate: 0,
			hideTravelynx: false,
			showCoachType: false,
			delayTime: false,
			lineAndNumber: false,
			showCancelled: true,
			sortByTime: false,
			onlyDepartures: false,
			startTime: undefined,
			lookahead: '115020',
			lookbehind: '10',
			showRl100: false,
			...commonConfig,
		};

		const wrappedComp = (
			<InnerCommonConfigProvider initialConfig={mergedCommonConfig}>
				<HeadProvider>
					<BrowserRouter>
						<StorageContext.Provider value={cookies}>
							<ThemeProvider>
								<ThemeWrap>{result}</ThemeWrap>
							</ThemeProvider>
						</StorageContext.Provider>
					</BrowserRouter>
				</HeadProvider>
			</InnerCommonConfigProvider>
		);

		return mount(wrappedComp);
	},
);

// Example use:
// cy.mount(<MyComponent />)
