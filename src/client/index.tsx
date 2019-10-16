import 'core-js/stable';
import { BrowserRouter } from 'react-router-dom';
import { CookieContext } from 'Common/useCookies';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from 'Common/container/ThemeContainer';
import axios from 'axios';
import Cookies from 'universal-cookie';
import React from 'react';
import ReactDOM from 'react-dom';
import ThemeWrap from './ThemeWrap';

// 10s timeout
axios.defaults.timeout = 10000;

global.smallScreen = window.matchMedia('(max-width: 480px)').matches;

const container = document.getElementById('app');
const cookies = new Cookies();

const render = (App: React.ComponentType) => (
  <HelmetProvider>
    <BrowserRouter>
      <CookieContext.Provider value={cookies}>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </CookieContext.Provider>
    </BrowserRouter>
  </HelmetProvider>
);

ReactDOM.hydrate(render(ThemeWrap), container);

// @ts-ignore
if (module.hot) {
  // @ts-ignore
  module.hot.accept('./ThemeWrap', () => {
    const App = require('./ThemeWrap').default;

    ReactDOM.render(render(App), container);
  });
}
