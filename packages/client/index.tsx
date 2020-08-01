import { BrowserRouter } from 'react-router-dom';
import { ClientStorage } from 'client/Common/Storage';
import { HelmetProvider } from 'react-helmet-async';
import { hydrate, render } from 'react-dom';
import { loadableReady } from '@loadable/component';
import { StorageContext } from 'shared/hooks/useStorage';
import { ThemeProvider } from 'client/Common/container/ThemeContainer';
import { ThemeWrap } from './ThemeWrap';
import request from 'umi-request';
import type { ComponentType } from 'react';
// 15s timeout
request.extendOptions({
  timeout: 15000,
});

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
