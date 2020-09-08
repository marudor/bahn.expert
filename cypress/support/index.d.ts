/* eslint-disable no-redeclare */
/* eslint-disable @typescript-eslint/no-unused-vars */

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
      navigateToStation(
        value: string,
        options?: {
          isStubbed?: boolean;
          findPrefix?: string;
        },
      ): void;
      closeModal(): void;
      mockFrankfurt(options?: MockOptions): void;
      mockHamburg(options?: MockOptions): void;
      mockHannover(options?: MockOptions): void;
      openSettings(): void;
    }
  }
}

export {};
