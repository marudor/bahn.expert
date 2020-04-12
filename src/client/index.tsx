import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { loadableReady } from '@loadable/component';
import { StorageContext } from 'shared/hooks/useStorage';
import { ThemeProvider } from 'Common/container/ThemeContainer';
import axios from 'axios';
import React from 'react';
import ReactDOM from 'react-dom';
import Storage from 'Common/Storage';
import ThemeWrap from './ThemeWrap';
// 15s timeout
axios.defaults.timeout = 15000;

global.smallScreen = window.matchMedia('(max-width: 480px)').matches;

const storage = new Storage();

const render = (App: React.ComponentType) => (
  <HelmetProvider>
    <BrowserRouter>
      <StorageContext.Provider value={storage}>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </StorageContext.Provider>
    </BrowserRouter>
  </HelmetProvider>
);

const container = document.getElementById('app');

loadableReady(() => {
  ReactDOM.hydrate(render(ThemeWrap), container);
});

// @ts-expect-error
if (module.hot) {
  // @ts-expect-error
  module.hot.accept('./ThemeWrap', () => {
    const App = require('./ThemeWrap').default;

    ReactDOM.render(render(App), container);
  });
}
