// @flow
import './index.scss';
import '@babel/polyfill';
import 'typeface-roboto';
import { applyMiddleware, compose, createStore } from 'redux';
import { Provider } from 'react-redux';
import BahnhofsAbfahrten from './Components/BahnhofsAbfahrten';
import promiseMiddleware from 'redux-promise';
import React from 'react';
import ReactDOM from 'react-dom';
import reducer from './reducer';

global.smallScreen = window.matchMedia('(max-width: 480px)').matches;

const middlewares = [promiseMiddleware];

if (process.env.NODE_ENV !== 'production') {
  const reduxUnhandledAction = require('redux-unhandled-action').default;

  middlewares.push(reduxUnhandledAction());
}

// eslint-disable-next-line
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  reducer,
  // eslint-disable-next-line
  undefined,
  composeEnhancers(applyMiddleware(...middlewares))
);

// $FlowFixMe
if (module.hot) {
  // Enable Webpack hot module replacement for reducers
  // $FlowFixMe
  module.hot.accept('./reducer', () => {
    const nextRootReducer = require('./reducer/index').default;

    store.replaceReducer(nextRootReducer);
  });
}

const container = document.getElementById('abfahrten');

if (container) {
  ReactDOM.render(
    <Provider store={store}>
      <BahnhofsAbfahrten />
    </Provider>,
    container
  );
} else {
  // eslint-disable-next-line
  alert('trollololo');
}
