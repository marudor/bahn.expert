import { BrowserRouter } from 'react-router-dom';
import { ComponentType } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { loadableReady } from '@loadable/component';
import { StorageContext } from 'shared/hooks/useStorage';
import { ThemeProvider } from 'Common/container/ThemeContainer';
import axios from 'axios';
import ReactDOM from 'react-dom';
import Storage from 'Common/Storage';
import ThemeWrap from './ThemeWrap';
// 15s timeout
axios.defaults.timeout = 15000;

const storage = new Storage();

const render = (App: ComponentType) => (
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

// @ts-ignore
if (module.hot) {
  // @ts-ignore
  module.hot.accept('./ThemeWrap', () => {
    const App = require('./ThemeWrap').default;

    ReactDOM.render(render(App), container);
  });
}
