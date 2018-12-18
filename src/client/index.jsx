// @flow
import './index.scss';
import '@babel/polyfill';
import 'typeface-roboto';
import { BrowserRouter } from 'react-router-dom';
// $FlowFixMe
import { createGenerateClassName, MuiThemeProvider } from '@material-ui/core/styles';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import BahnhofsAbfahrten from './Components/BahnhofsAbfahrten';
import createStore from './createStore';
import createTheme from './createTheme';
import JssProvider from 'react-jss/lib/JssProvider';
import React from 'react';
import ReactDOM from 'react-dom';

global.smallScreen = window.matchMedia('(max-width: 480px)').matches;

const container = document.getElementById('app');
const theme = createTheme();
const generateClassName = createGenerateClassName();

if (container) {
  ReactDOM.render(
    <Provider store={createStore()}>
      <HelmetProvider context={{}}>
        <JssProvider generateClassName={generateClassName}>
          <MuiThemeProvider theme={theme}>
            <BrowserRouter>
              <BahnhofsAbfahrten />
            </BrowserRouter>
          </MuiThemeProvider>
        </JssProvider>
      </HelmetProvider>
    </Provider>,
    container
  );
} else {
  // eslint-disable-next-line
  alert('trollololo');
}
