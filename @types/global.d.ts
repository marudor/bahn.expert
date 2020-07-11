// eslint-disable-next-line import/no-extraneous-dependencies
import nock from 'nock';

declare global {
  declare const nock: nock.Scope;
  declare namespace NodeJS {
    declare interface Global {
      M: any;
      MF: any;
      TEST: boolean;
      PROD: boolean;
      SERVER: boolean;
      VERSION: string;
      BASE_URL: string;
      IMPRINT: {
        name: string;
        street: string;
        town: string;
      };
      configOverride: {
        abfahrten: any;
        common: any;
      };
      // test only
      nock: nock.Scope;
    }
  }

  type ExcludesFalse = <T>(x: T | undefined | void | null | false) => x is T;
}
