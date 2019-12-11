/* eslint-disable no-underscore-dangle */
import { CommonConfig } from 'Common/config';
import { Container } from 'unstated-next';
import { CookieContext } from 'Common/useCookies';
import { defaultCommonConfig } from 'client/util';
import { HelmetProvider } from 'react-helmet-async';
import { Location } from 'history';
import { MemoryRouter, useLocation } from 'react-router';
import { MergedTheme } from '@material-ui/styles';
import { render as realRender } from '@testing-library/react';
import { ThemeProvider } from 'Common/container/ThemeContainer';
import { ThemeType } from 'client/Themes/type';
import CommonConfigContainer from 'Common/container/CommonConfigContainer';
import Cookies from 'universal-cookie';
import createTheme from 'client/Themes';
import Navigation from 'Common/Components/Navigation';
import React, { ComponentProps, ComponentType } from 'react';
import ThemeWrap from 'client/ThemeWrap';

let currentThemeType: ThemeType;
let theme: MergedTheme;

interface ContainerWithOptions extends Container<any, any> {
  initialState?: any;
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

export function render<CP extends ComponentType<any>>(
  Comp: CP,
  props?: ComponentProps<CP>,
  { withNavigation, container, commonConfig }: Options = {}
) {
  const themeType = ThemeType.light;

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
      container.forEach(c => {
        result = (
          <c.Provider initialState={c.initialState}>{result}</c.Provider>
        );
      });
    }

    const mergedCommonConfig = {
      ...defaultCommonConfig,
      ...commonConfig,
    };

    return (
      <CommonConfigContainer.Provider initialState={mergedCommonConfig}>
        <HelmetProvider>
          <MemoryRouter>
            <LocationHelper>
              <CookieContext.Provider value={cookies}>
                <ThemeProvider>
                  <ThemeWrap>{result}</ThemeWrap>
                </ThemeProvider>
              </CookieContext.Provider>
            </LocationHelper>
          </MemoryRouter>
        </HelmetProvider>
      </CommonConfigContainer.Provider>
    );
  };

  // @ts-ignore
  const p: P = props || {};
  // @ts-ignore
  const rendered = realRender(<Comp {...p} />, { wrapper });

  return {
    ...rendered,
    container: rendered.container.firstChild,
    theme,
    cookies,
    getLocation: () => location,
  };
}
