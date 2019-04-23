import './font.css';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import { StylesProvider, ThemeProvider } from '@material-ui/styles';
import axios from 'axios';
import createStore from './createStore';
import createStyleProviderProps from './createStylesProviderProps';
import createTheme from './createTheme';
import MainApp from './App';
import React from 'react';
import ReactDOM from 'react-dom';

// 10s timeout
axios.defaults.timeout = 10000;

global.smallScreen = window.matchMedia('(max-width: 480px)').matches;

const container = document.getElementById('app');
const theme = createTheme();
const store = createStore();

const render = (App: React.ComponentType) => (
  <Provider store={store}>
    <StylesProvider {...createStyleProviderProps}>
      <ThemeProvider theme={theme}>
        <HelmetProvider context={{}}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </HelmetProvider>
      </ThemeProvider>
    </StylesProvider>
  </Provider>
);

ReactDOM.hydrate(render(MainApp), container);

// @ts-ignore
if (module.hot) {
  // @ts-ignore
  module.hot.accept('./App', () => {
    const App = require('./App').default;

    ReactDOM.render(render(App), container);
  });
}
