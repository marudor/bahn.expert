/* eslint-disable no-underscore-dangle */
import { getStore } from 'testHelper';
import { MemoryRouter } from 'react-router';
import { MergedTheme } from '@material-ui/styles';
import { Provider } from 'react-redux';
import { render as realRender } from '@testing-library/react';
import { ThemeType } from 'client/Themes/type';
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
  const themeType = store.getState().config.theme;

  if (currentThemeType !== themeType) {
    currentThemeType = themeType;
    theme = createTheme(currentThemeType);
  }

  comp = (
    <MemoryRouter>
      <Provider store={store}>
        <ThemeWrap>{comp}</ThemeWrap>
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
