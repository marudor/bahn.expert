// @flow
import { Actions } from 'client/actions/config';
import { applyMiddleware, compose, createStore } from 'redux';
import Cookies from 'universal-cookie';
import promiseMiddleware from 'redux-promise';
import reducer from './reducer';
import thunkMiddleware from 'redux-thunk';
import type { AppState } from 'AppState';

export default () => {
  const middlewares = [promiseMiddleware, thunkMiddleware];

  if (process.env.NODE_ENV !== 'production') {
    const reduxUnhandledAction = require('redux-unhandled-action').default;

    middlewares.push(reduxUnhandledAction());
  }

  // eslint-disable-next-line
  const composeEnhancers = global.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  const store = createStore<AppState, *, *>(
    reducer,
    // eslint-disable-next-line no-underscore-dangle
    global.__DATA__,
    composeEnhancers(applyMiddleware(...middlewares))
  );

  store.dispatch(Actions.setCookies(new Cookies()));

  // $FlowFixMe
  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    // $FlowFixMe
    module.hot.accept('./reducer', () => {
      const nextRootReducer = require('./reducer/index').default;

      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
};
