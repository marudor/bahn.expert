import { BrowserRouter } from 'react-router-dom';
import { ClientStorage } from 'client/Common/Storage';
import { HelmetProvider } from 'react-helmet-async';
import { hydrate, render } from 'react-dom';
import { loadableReady } from '@loadable/component';
import { StorageContext } from 'client/useStorage';
import { ThemeProvider } from 'client/Common/provider/ThemeProvider';
import { ThemeWrap } from './ThemeWrap';
import Axios from 'axios';
import type { ComponentType } from 'react';
// 15s timeout
Axios.defaults.timeout = 15000;

const storage = new ClientStorage();

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

void loadableReady(() => {
  hydrate(renderApp(ThemeWrap), container);
});

// @ts-expect-error hot not typed
if (module.hot) {
  // @ts-expect-error hot not typed
  module.hot.accept('./ThemeWrap', () => {
    const App = require('./ThemeWrap').default;

    render(renderApp(App), container);
  });
}
