import { applyMiddleware, compose, createStore } from 'redux';
import { AppState } from 'AppState';
import Actions from 'Abfahrten/actions/config';
import Cookies from 'universal-cookie';
import reducer from './reducer';
import thunkMiddleware from 'redux-thunk';

// eslint-disable-next-line no-underscore-dangle
export default (state: Partial<AppState> = global.__DATA__) => {
  const middlewares = [thunkMiddleware];

  if (process.env.NODE_ENV !== 'production') {
    const reduxUnhandledAction = require('redux-unhandled-action').default;

    middlewares.push(reduxUnhandledAction());
  }

  const composeEnhancers =
    // eslint-disable-next-line no-underscore-dangle
    global.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  const store = createStore<AppState, any, {}, {}>(
    reducer,
    state,
    composeEnhancers(applyMiddleware(...middlewares))
  );

  if (!global.PROD && !global.SERVER) {
    Object.defineProperty(global, 'state', {
      get() {
        return store.getState();
      },
    });
  }

  store.dispatch(Actions.setCookies(new Cookies()));

  // @ts-ignore
  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    // @ts-ignore
    module.hot.accept('./reducer', () => {
      const nextRootReducer = require('./reducer').default;

      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
};
