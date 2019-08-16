/* eslint-disable no-underscore-dangle */
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
};

export function render<P>(
  Comp: ComponentType<P>,
  props?: P,
  { withNavigation }: Options = {}
) {
  // @ts-ignore
  const p: P = props || {};

  let comp = <Comp {...p} />;

  if (withNavigation) {
    comp = <Navigation>{comp}</Navigation>;
  }

  const store = getStore();
  const themeType = ThemeType.light;

  if (currentThemeType !== themeType) {
    currentThemeType = themeType;
    theme = createTheme(currentThemeType);
  }

  comp = (
    <MemoryRouter>
      <Provider store={store}>
        <CookieContext.Provider value={new Cookies()}>
          <ThemeProvider>
            <ThemeWrap>{comp}</ThemeWrap>
          </ThemeProvider>
        </CookieContext.Provider>
      </Provider>
    </MemoryRouter>
  );

  const rendered = realRender(comp);

  return {
    ...rendered,
    container: rendered.container.firstElementChild as HTMLElement,
    theme,
  };
}
