/* eslint-disable no-underscore-dangle */
import '@testing-library/jest-dom/extend-expect';
import { cleanup } from '@testing-library/react';

if (process.env.TZ !== 'UTC') {
  throw new Error('Please start tests with TZ=UTC to ensure stable times');
}

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
