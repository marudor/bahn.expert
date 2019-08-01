namespace NodeJS {
  interface Global {
    TEST: boolean;
    PROD: boolean;
    SERVER: boolean;
    VERSION: string;
    IMPRINT: {
      name: string;
      street: string;
      town: string;
    };
    smallScreen: boolean;
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: Function;
    __DATA__: Object;
    __ConfigOverride__?: Object;
    testUrl: string;
  }
}

type ExcludesFalse = <T>(x: T | undefined | null | false) => x is T;
