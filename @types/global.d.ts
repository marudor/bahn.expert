import { AbfahrtenConfig } from 'Common/config';
import nock from 'nock';

declare global {
  declare const nock: nock.Scope;
  declare namespace NodeJS {
    declare interface Global {
      TEST: boolean;
      PROD: boolean;
      SERVER: boolean;
      IMPRINT: {
        name: string;
        street: string;
        town: string;
      };
      smallScreen: boolean;
      baseUrl: string;
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
