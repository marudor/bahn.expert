/* eslint-disable no-underscore-dangle */
import 'jest-dom/extend-expect';
import { cleanup } from 'react-testing-library';

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
