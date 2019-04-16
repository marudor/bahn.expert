namespace NodeJS {
  interface Global {
    PROD: boolean;
    SERVER: boolean;
    smallScreen: boolean;
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: Function;
    __DATA__: Object;
  }
}

type Features = {
  'google-analytics': boolean;
  routing: boolean;
};
