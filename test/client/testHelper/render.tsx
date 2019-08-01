/* eslint-disable no-underscore-dangle */
import { AppState } from 'AppState';
import { DeepPartial } from 'utility-types';
import { getStore } from 'testHelper';
import { MemoryRouter } from 'react-router';
import { MergedTheme } from '@material-ui/styles';
import { Provider } from 'react-redux';
import { render as realRender } from '@testing-library/react';
import { ThemeType } from 'client/Themes/type';
import createTheme from 'client/Themes';
import React, { ComponentType } from 'react';
import ThemeWrap from 'client/ThemeWrap';

let currentThemeType: ThemeType;
let theme: MergedTheme;

export function render<P>(
  Comp: ComponentType<P>,
  // @ts-ignore
  props: P,
  partialState?: DeepPartial<AppState>
) {
  const store = getStore();
  const themeType = store.getState().config.theme;

  if (currentThemeType !== themeType) {
    currentThemeType = themeType;
    theme = createTheme(currentThemeType);
  }

  if (partialState) {
    store.modify(partialState);
  }

  const rendered = realRender(
    <MemoryRouter>
      <Provider store={store}>
        <ThemeWrap>
          <Comp {...props} />
        </ThemeWrap>
      </Provider>
    </MemoryRouter>
  );

  return {
    ...rendered,
    container: rendered.container.firstElementChild as HTMLElement,
    theme,
  };
}
