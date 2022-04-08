import { BrowserRouter } from 'react-router-dom';
import { ClientStorage } from 'client/Common/Storage';
import { HelmetProvider } from 'react-helmet-async';
import { hydrateRoot } from 'react-dom/client';
import { loadableReady } from '@loadable/component';
import { StorageContext } from 'client/useStorage';
import { ThemeProvider } from 'client/Common/provider/ThemeProvider';
import { ThemeWrap } from './ThemeWrap';
import Axios from 'axios';
import qs from 'qs';
import React from 'react';
import type { ComponentType } from 'react';
// 15s timeout
Axios.defaults.timeout = 15000;

const isoDateRegex =
  /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/;
Axios.defaults.transformResponse = [
  (data) => {
    if (typeof data === 'string') {
      try {
        return JSON.parse(data, (_key, value) => {
          if (typeof value === 'string') {
            if (isoDateRegex.exec(value)) {
              return new Date(value);
            }
          }
          return value;
        });
      } catch {
        // Ignoring
      }
    }
    return data;
  },
];
Axios.defaults.paramsSerializer = (p) =>
  qs.stringify(p, { arrayFormat: 'repeat' });

const storage = new ClientStorage();

const renderApp = (App: ComponentType) => (
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <StorageContext.Provider value={storage}>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </StorageContext.Provider>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);

const container = document.getElementById('app')!;

let root: ReturnType<typeof hydrateRoot>;

void loadableReady(() => {
  root = hydrateRoot(container, renderApp(ThemeWrap));
});

// @ts-expect-error hot not typed
if (module.hot) {
  // @ts-expect-error hot not typed
  module.hot.accept('./ThemeWrap', () => {
    const App = require('./ThemeWrap').default;

    if (root) {
      root.render(renderApp(App));
    }
  });
}
