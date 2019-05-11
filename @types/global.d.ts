namespace NodeJS {
  interface Global {
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
  }
}

type ExcludesFalse = <T>(x: T | undefined | null | false) => x is T;
type Omit<T, K extends keyof any> = Pick<T, SetDifference<keyof T, K>>;
