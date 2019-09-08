import nock from 'nock';

declare global {
  declare const nock: nock.Scope;
  declare namespace NodeJS {
    declare interface Global {
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
      testUrl: string;
      baseUrl: string;

      // test only
      nock: nock.Scope;
    }
  }

  type ExcludesFalse = <T>(x: T | undefined | null | false) => x is T;
}
