/* eslint-disable no-redeclare */
import { MarudorConfig } from '../../src/client/Common/config';

declare global {
  namespace Cypress {
    interface Chainable<Subject = any> {
      /**
       * Custom command to select DOM element by data-cy attribute.
       * @example cy.dataCy('greeting')
       */
      navigateToStation(value: string, addRoute?: boolean): void;
      closeModal(): void;
      mockFrankfurt(): void;
      getAbfahrtenConfig(): Cypress.Chainable<MarudorConfig>;
    }
  }
}

export {};
