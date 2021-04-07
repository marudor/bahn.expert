// eslint-disable-next-line import/no-extraneous-dependencies
import nock from 'nock';

declare global {
  declare namespace globalThis {
    declare var IMPRINT: {
      name: string;
      street: string;
      town: string;
    };
    declare var configOverride: {
      abfahrten: any;
      common: any;
    };
    declare var VERSION: string;
    declare var BASE_URL: string;

    // test only
    declare var nock: nock.Scope;
    declare var parseJson: <T = unknown>(json: string) => T;
  }

  interface Navigator {
    standalone?: boolean;
  }

  type ExcludesFalse = <T>(x: T | undefined | void | null | false) => x is T;
}
