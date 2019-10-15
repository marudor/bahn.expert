import 'core-js/stable';
import { BrowserRouter } from 'react-router-dom';
import { CookieContext } from 'Common/useCookies';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'Common/container/ThemeContainer';
import axios from 'axios';
import Cookies from 'universal-cookie';
import createStore from './createStore';
import React from 'react';
import ReactDOM from 'react-dom';
import ThemeWrap from './ThemeWrap';

// 10s timeout
axios.defaults.timeout = 10000;

global.smallScreen = window.matchMedia('(max-width: 480px)').matches;

const container = document.getElementById('app');
const cookies = new Cookies();
const store = createStore();

const render = (App: React.ComponentType) => (
  <Provider store={store}>
    <BrowserRouter>
      <CookieContext.Provider value={cookies}>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </CookieContext.Provider>
    </BrowserRouter>
  </Provider>
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
