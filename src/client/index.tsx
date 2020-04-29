import { BrowserRouter } from 'react-router-dom';
import { ComponentType } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { hydrate, render } from 'react-dom';
import { loadableReady } from '@loadable/component';
import { StorageContext } from 'shared/hooks/useStorage';
import { ThemeProvider } from 'Common/container/ThemeContainer';
import axios from 'axios';
import Storage from 'Common/Storage';
import ThemeWrap from './ThemeWrap';
// 15s timeout
axios.defaults.timeout = 15000;

const storage = new Storage();

const renderApp = (App: ComponentType) => (
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
  hydrate(renderApp(ThemeWrap), container);
});

// @ts-ignore
if (module.hot) {
  // @ts-ignore
  module.hot.accept('./ThemeWrap', () => {
    const App = require('./ThemeWrap').default;

    render(renderApp(App), container);
  });
}
