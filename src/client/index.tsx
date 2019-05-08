import './font.css';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@material-ui/styles';
import axios from 'axios';
import createStore from './createStore';
import createThemes, { ThemeType } from './Themes';
import React from 'react';
import ReactDOM from 'react-dom';
import ThemeWrap from './ThemeWrap';

// 10s timeout
axios.defaults.timeout = 10000;

global.smallScreen = window.matchMedia('(max-width: 480px)').matches;

const container = document.getElementById('app');
const store = createStore();

const render = (App: React.ComponentType) => (
  <Provider store={store}>
    <HelmetProvider context={{}}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
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
