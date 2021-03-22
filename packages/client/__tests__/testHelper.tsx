/* eslint-disable no-underscore-dangle */
import { createTheme } from 'client/Themes';
import { HelmetProvider } from 'react-helmet-async';
import { InnerCommonConfigProvider } from 'client/Common/provider/CommonConfigProvider';
import { MemoryRouter, useLocation } from 'react-router';
import { Navigation } from 'client/Common/Components/Navigation';
import { render as realRender } from '@testing-library/react';
import { StorageContext } from 'client/useStorage';
import { ThemeProvider } from 'client/Common/provider/ThemeProvider';
import { ThemeType } from 'client/Themes/type';
import { ThemeWrap } from 'client/ThemeWrap';
import Cookies from 'universal-cookie';
import type { CommonConfig } from 'client/Common/config';
import type { ComponentProps, ComponentType } from 'react';
import type { DefaultTheme } from '@material-ui/styles';
import type { Location } from 'history';
import type { Rule, StyleSheet } from 'jss';

let currentThemeType: ThemeType;
let theme: DefaultTheme;

interface ContextWithOptions<V = any> extends React.Context<V> {
  initialState?: V;
}
export interface ProviderWithOptions<
  C extends React.FunctionComponent = React.FunctionComponent<any>
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

let location: Location<any>;

const LocationHelper = ({ children }: any) => {
  location = useLocation();

  return children;
};

const generateClassName = (rule: Rule, sheet?: StyleSheet<string>) => {
  // @ts-expect-error sheet wrongly typed
  const name = `${sheet.options.name}-${rule.key}`;

  return name;
};

export function render<CP extends ComponentType<any>>(
  Comp: CP,
  props?: ComponentProps<CP>,
  { withNavigation, context, commonConfig, provider }: Options = {},
): Omit<ReturnType<typeof realRender>, 'container'> & {
  container: ChildNode | null;
  theme: DefaultTheme;
  cookies: Cookies;
  getLocation: () => Location;
} {
  const themeType = ThemeType.dark;

  if (currentThemeType !== themeType) {
    currentThemeType = themeType;
    theme = createTheme(currentThemeType);
  }

  const cookies = new Cookies();
  const wrapper = ({ children }: any) => {
    let result = children;

    if (withNavigation) {
      result = <Navigation>{result}</Navigation>;
    }

    if (context) {
      context.forEach((c) => {
        result = <c.Provider value={c.initialState}>{result}</c.Provider>;
      });
    }

    if (provider) {
      provider.forEach(({ Provider, initialState }) => {
        result = <Provider {...initialState}>{result}</Provider>;
      });
    }

    const mergedCommonConfig = {
      time: true,
      zoomReihung: true,
      showUIC: false,
      fahrzeugGruppe: false,
      ...commonConfig,
    };

    return (
      <InnerCommonConfigProvider initialConfig={mergedCommonConfig}>
        <HelmetProvider>
          <MemoryRouter>
            <LocationHelper>
              <StorageContext.Provider value={cookies}>
                <ThemeProvider>
                  <ThemeWrap generateClassName={generateClassName}>
                    {result}
                  </ThemeWrap>
                </ThemeProvider>
              </StorageContext.Provider>
            </LocationHelper>
          </MemoryRouter>
        </HelmetProvider>
      </InnerCommonConfigProvider>
    );
  };

  // @ts-expect-error this works
  const p: ComponentProps<CP> = props || {};
  const rendered = realRender(<Comp {...p} />, { wrapper });

  return {
    ...rendered,
    container: rendered.container.firstChild,
    theme,
    cookies,
    getLocation: () => location,
  };
}
