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
    declare var BASE_URL: string;
    declare var RAW_BASE_URL: string;

    // test only
    declare var nock: nock.Scope;
    declare var parseJson: <T = unknown>(json: string) => T;
  }

  interface Navigator {
    standalone?: boolean;
  }
  type Falsy = false | 0 | '' | null | undefined | void;
  interface Array<T> {
    filter<S extends T>(
      predicate: BooleanConstructor,
      thisArg?: any,
    ): Exclude<S, Falsy>[];
  }
  type E<T extends const> = T[keyof T];
}
