/* eslint-disable no-underscore-dangle */
import { createTheme } from 'client/Themes';
import { HelmetProvider } from 'react-helmet-async';
import { InnerCommonConfigProvider } from 'client/Common/provider/CommonConfigProvider';
import { MemoryRouter, useLocation } from 'react-router';
import { Navigation } from 'client/Common/Components/Navigation';
import { render as realRender } from '@testing-library/react';
import { StorageContext } from 'client/useStorage';
import { ThemeProvider } from 'client/Common/provider/ThemeProvider';
import { ThemeWrap } from 'client/ThemeWrap';
import Cookies from 'universal-cookie';
import type { CommonConfig } from 'client/Common/config';
import type { Location } from 'react-router';
import type { ReactElement } from 'react';
import type { Theme } from '@mui/material';
import type { ThemeType } from 'client/Themes/type';

let currentThemeType: E<typeof ThemeType>;

let theme: Theme;

interface ContextWithOptions<V = any> extends React.Context<V> {
  initialState?: V;
}
export interface ProviderWithOptions<
  C extends React.FunctionComponent = React.FunctionComponent<any>,
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

let location: Location;

const LocationHelper = ({ children }: any) => {
  location = useLocation();

  return children;
};

// const generateClassName = (rule: Rule, sheet?: StyleSheet<string>) => {
//   // @ts-expect-error sheet wrongly typed
//   const name = `${sheet.options.name}-${rule.key}`;

//   return name;
// };

export function render(
  ui: ReactElement,
  { withNavigation, context, commonConfig, provider }: Options = {},
): Omit<ReturnType<typeof realRender>, 'container'> & {
  container: ChildNode | null;
  theme: Theme;
  cookies: Cookies;
  getLocation: () => Location;
} {
  const themeType = 'dark';

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
      for (const c of context) {
        result = <c.Provider value={c.initialState}>{result}</c.Provider>;
      }
    }

    if (provider) {
      for (const { Provider, initialState } of provider) {
        result = <Provider {...initialState}>{result}</Provider>;
      }
    }

    const mergedCommonConfig = {
      time: true,
      zoomReihung: true,
      showUIC: false,
      fahrzeugGruppe: false,
      autoUpdate: 0,
      hideTravelynx: false,
      showCoachType: false,
      ...commonConfig,
    };

    return (
      <InnerCommonConfigProvider initialConfig={mergedCommonConfig}>
        <HelmetProvider>
          <MemoryRouter>
            <LocationHelper>
              <StorageContext.Provider value={cookies}>
                <ThemeProvider>
                  <ThemeWrap>{result}</ThemeWrap>
                </ThemeProvider>
              </StorageContext.Provider>
            </LocationHelper>
          </MemoryRouter>
        </HelmetProvider>
      </InnerCommonConfigProvider>
    );
  };

  const view = realRender(ui, { wrapper });

  return {
    ...view,
    container: view.container.firstChild,
    theme,
    cookies,
    getLocation: () => location,
  };
}
