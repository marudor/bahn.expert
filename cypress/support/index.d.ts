/* eslint-disable no-redeclare */
import { AbfahrtenConfig } from '../../src/client/Common/config';

interface MockOptions {
  lookahead?: number;
  lookbehind?: number;
  delay?: number;
}
declare global {
  namespace Cypress {
    interface Chainable<Subject = any> {
      /**
       * Custom command to select DOM element by data-cy attribute.
       * @example cy.dataCy('greeting')
       */
      navigateToStation(value: string, isStubbed?: boolean): void;
      closeModal(): void;
      mockFrankfurt(options?: MockOptions): void;
      mockHamburg(options?: MockOptions): void;
      getAbfahrtenConfig(): Cypress.Chainable<AbfahrtenConfig>;
      openSettings(): void;
    }
  }
}

export {};
