import 'core-js/stable';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import axios from 'axios';
import createStore from './createStore';
import React from 'react';
import ReactDOM from 'react-dom';
import ThemeWrap from './ThemeWrap';

// 10s timeout
axios.defaults.timeout = 10000;

global.smallScreen = window.matchMedia('(max-width: 480px)').matches;
// @ts-ignore
// eslint-disable-next-line no-undef
global.VERSION = VERSION;

const container = document.getElementById('app');
const store = createStore();

const render = (App: React.ComponentType) => (
  <Provider store={store}>
    <BrowserRouter>
      <App />
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
