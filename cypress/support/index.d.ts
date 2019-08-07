declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to select DOM element by data-cy attribute.
     * @example cy.dataCy('greeting')
     */
    navigateToStation(value: string, addRoute?: boolean): void;
    closeModal(): void;
    mockFrankfurt(): void;
  }
}
