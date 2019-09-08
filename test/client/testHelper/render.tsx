/* eslint-disable no-underscore-dangle */
import { Container } from 'unstated-next';
import { CookieContext } from 'Common/useCookies';
import { getStore } from 'testHelper';
import { MemoryRouter } from 'react-router';
import { MergedTheme } from '@material-ui/styles';
import { Provider } from 'react-redux';
import { render as realRender } from '@testing-library/react';
import { ThemeProvider } from 'Common/container/ThemeContainer';
import { ThemeType } from 'client/Themes/type';
import Cookies from 'universal-cookie';
import createTheme from 'client/Themes';
import Navigation from 'Common/Components/Navigation';
import React, { ComponentType } from 'react';
import ThemeWrap from 'client/ThemeWrap';

let currentThemeType: ThemeType;
let theme: MergedTheme;

type Options = {
  withNavigation?: boolean;
  container?: Container<any>[];
};

export function render<P>(
  Comp: ComponentType<P>,
  props?: P,
  { withNavigation, container }: Options = {}
) {
  const store = getStore();
  const themeType = ThemeType.light;

  if (currentThemeType !== themeType) {
    currentThemeType = themeType;
    theme = createTheme(currentThemeType);
  }

  const wrapper = ({ children }: any) => {
    let result = children;

    if (withNavigation) {
      result = <Navigation>{result}</Navigation>;
    }

    if (container) {
      container.forEach(c => {
        result = <c.Provider>{result}</c.Provider>;
      });
    }

    return (
      <MemoryRouter>
        <Provider store={store}>
          <CookieContext.Provider value={new Cookies()}>
            <ThemeProvider>
              <ThemeWrap>{result}</ThemeWrap>
            </ThemeProvider>
          </CookieContext.Provider>
        </Provider>
      </MemoryRouter>
    );
  };

  // @ts-ignore
  const p: P = props || {};
  const rendered = realRender(<Comp {...p} />, { wrapper });

  return {
    ...rendered,
    container: rendered.container.firstChild,
    theme,
  };
}
