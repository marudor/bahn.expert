/* eslint-disable no-underscore-dangle */
import { Provider } from 'react-redux';
import { render as realRender } from 'react-testing-library';
import React, { ComponentType } from 'react';
import ThemeWrap from 'client/ThemeWrap';

export function render<P>(Comp: ComponentType<P>, props: P) {
  return realRender(
    // @ts-ignore
    <Provider store={global.__getTestStore__()}>
      <ThemeWrap>
        <Comp {...props} />
      </ThemeWrap>
    </Provider>
  );
}
