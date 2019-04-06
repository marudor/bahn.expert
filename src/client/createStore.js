// @flow
import { applyMiddleware, compose, createStore } from 'redux';
import Actions from 'Abfahrten/actions/config';
import Cookies from 'universal-cookie';
import promiseMiddleware from 'redux-promise';
import reducer from './reducer';
import thunkMiddleware from 'redux-thunk';
import type { AppState } from 'AppState';

// eslint-disable-next-line no-underscore-dangle
export default (state: $Shape<AppState> = global.__DATA__) => {
  const middlewares = [promiseMiddleware, thunkMiddleware];

  if (process.env.NODE_ENV !== 'production') {
    const reduxUnhandledAction = require('redux-unhandled-action').default;

    middlewares.push(reduxUnhandledAction());
  }

  // eslint-disable-next-line
  const composeEnhancers = global.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  const store = createStore<AppState, *, *>(reducer, state, composeEnhancers(applyMiddleware(...middlewares)));

  store.dispatch(Actions.setCookies(new Cookies()));

  // $FlowFixMe
  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    // $FlowFixMe
    module.hot.accept('./reducer', () => {
      const nextRootReducer = require('./reducer').default;

      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
};
