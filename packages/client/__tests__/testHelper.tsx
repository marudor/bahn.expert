/* eslint-disable no-underscore-dangle */
import { CommonConfig } from 'client/Common/config';
import { CommonConfigContainer } from 'client/Common/container/CommonConfigContainer';
import { createTheme } from 'client/Themes';
import { DefaultTheme } from 'styled-components';
import { HelmetProvider } from 'react-helmet-async';
import { MemoryRouter, useLocation } from 'react-router';
import { Navigation } from 'client/Common/Components/Navigation';
import { render as realRender } from '@testing-library/react';
import { StorageContext } from 'shared/hooks/useStorage';
import { ThemeProvider } from 'client/Common/container/ThemeContainer';
import { ThemeType } from 'client/Themes/type';
import { ThemeWrap } from 'client/ThemeWrap';
import Cookies from 'universal-cookie';
import type { ComponentProps, ComponentType } from 'react';
import type { Container } from 'unstated-next';
import type { Location } from 'history';
import type { Rule, StyleSheet } from 'jss';

let currentThemeType: ThemeType;
let theme: DefaultTheme;

interface ContainerWithOptions<V = any> extends Container<V, any> {
  initialState?: V;
}
interface Options {
  withNavigation?: boolean;
  container?: ContainerWithOptions[];
  commonConfig?: Partial<CommonConfig>;
}

let location: Location<any>;

const LocationHelper = ({ children }: any) => {
  location = useLocation();

  return children;
};

const generateClassName = (rule: Rule, sheet?: StyleSheet<string>) => {
  // @ts-ignore
  const name = `${sheet.options.name}-${rule.key}`;

  return name;
};

export function render<CP extends ComponentType<any>>(
  Comp: CP,
  props?: ComponentProps<CP>,
  { withNavigation, container, commonConfig }: Options = {}
) {
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

    if (container) {
      container.forEach((c) => {
        result = (
          <c.Provider initialState={c.initialState}>{result}</c.Provider>
        );
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
      <CommonConfigContainer.Provider initialState={mergedCommonConfig}>
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
      </CommonConfigContainer.Provider>
    );
  };

  // @ts-ignore
  const p: P = props || {};
  const rendered = realRender(<Comp {...p} />, { wrapper });

  return {
    ...rendered,
    container: rendered.container.firstChild,
    theme,
    cookies,
    getLocation: () => location,
  };
}
