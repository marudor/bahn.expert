// @flow
import '@babel/polyfill';
import 'typeface-roboto';
import { BrowserRouter } from 'react-router-dom';
// $FlowFixMe
import { createGenerateClassName, MuiThemeProvider } from '@material-ui/core/styles';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import axios from 'axios';
import BahnhofsAbfahrten from './Components/BahnhofsAbfahrten';
import createStore from './createStore';
import createTheme from './createTheme';
import JssProvider from 'react-jss/lib/JssProvider';
import React from 'react';
import ReactDOM from 'react-dom';

// 10s timeout
axios.defaults.timeout = 10000;

global.smallScreen = window.matchMedia('(max-width: 480px)').matches;

const container = document.getElementById('app');
const theme = createTheme();
const generateClassName = createGenerateClassName();
const store = createStore();

const render = App => (
  <Provider store={store}>
    <JssProvider generateClassName={generateClassName}>
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

// $FlowFixMe
ReactDOM.hydrate(render(BahnhofsAbfahrten), container);

// $FlowFixMe
if (module.hot) {
  module.hot.accept('./Components/BahnhofsAbfahrten', () => {
    const App = require('./Components/BahnhofsAbfahrten').default;

    // $FlowFixMe
    ReactDOM.render(render(App), container);
  });
}

if ('serviceWorker' in navigator) {
  // $FlowFixMe
  navigator.serviceWorker?.ready.then(registration => {
    registration.unregister();
  });
}
