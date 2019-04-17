import './font.css';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { Provider } from 'react-redux';
import axios from 'axios';
import createJssProviderProps from './createJssProviderProps';
import createStore from './createStore';
import createTheme from './createTheme';
import JssProvider from 'react-jss/lib/JssProvider';
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
    <JssProvider {...createJssProviderProps()}>
      <MuiThemeProvider theme={theme}>
        <HelmetProvider context={{}}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </HelmetProvider>
      </MuiThemeProvider>
    </JssProvider>
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
