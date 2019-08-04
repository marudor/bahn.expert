/* eslint-disable no-underscore-dangle */
import '@testing-library/jest-dom/extend-expect';
import { cleanup } from '@testing-library/react';

expect(new Date().getTimezoneOffset()).toBe(0);

afterEach(() => {
  cleanup();
  try {
    // @ts-ignore
    const store = window.__getTestStore__();

    store.restore();
  } catch (e) {
    // we ignore this
  }
});

// @ts-ignore just mocked
window.matchMedia = () => ({
  matches: false,
});
