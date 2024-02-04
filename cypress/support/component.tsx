import './commands';
import { mount } from 'cypress/react18';
import type { CommonConfig } from '@/client/Common/config';
import type { ReactElement } from 'react';
import { GlobalCSS } from '@/client/App';
import Cookies from 'universal-cookie';
import { Navigation } from '@/client/Common/Components/Navigation';
import { InnerCommonConfigProvider } from '@/client/Common/provider/CommonConfigProvider';
import { HeadProvider } from 'react-head';
import { StorageContext } from '@/client/useStorage';
import { ThemeProvider } from '@/client/Common/provider/ThemeProvider';
import { ThemeWrap } from '@/client/ThemeWrap';
import { createTheme } from '@/client/Themes';
import { Theme } from '@mui/material';
import '@percy/cypress';
import { BrowserRouter } from 'react-router-dom';

const hexToRgb = (hex: string) => {
  const rValue = Number.parseInt(hex.slice(1, 3), 16);
  const gValue = Number.parseInt(hex.slice(3, 5), 16);
  const bValue = Number.parseInt(hex.slice(5), 16);
  return `rgb(${rValue}, ${gValue}, ${bValue})`;
};

chai.use((chai, utils) => {
  utils.overwriteMethod(
    chai.Assertion.prototype,
    'css',
    // eslint-disable-next-line @typescript-eslint/ban-types
    function (_super: Function) {
      return function (this: any, propertyName: string, value: string) {
        if (propertyName === 'color' && value.startsWith('#')) {
          Reflect.apply(_super, this, [propertyName, hexToRgb(value)]);
        } else {
          // eslint-disable-next-line prefer-rest-params
          Reflect.apply(_super, this, arguments);
        }
      };
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
      getTheme: () => Chainable<Theme>;
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

Cypress.Commands.add('getTheme', () =>
  cy.window().then((w) => createTheme(w.RENDERED_THEME as any)),
);

Cypress.Commands.add(
  'mount',
  (
    component: ReactElement,
    { withNavigation, context, commonConfig, provider }: Options = {},
  ) => {
    const cookies = new Cookies();
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
