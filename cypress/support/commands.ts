import '@testing-library/cypress/add-commands';

Cypress.Commands.add(
  'navigateToStation',
  (value: string, addRoute: boolean = true) => {
    cy.server();
    if (addRoute) {
      cy.route(/\/api\/iris\/current\/abfahrten.*/).as('irisAbfahrten');
    }
    cy.getByTestId('stationSearchInput').type(value);
    cy.getAllByTestId('stationSearchMenuItem')
      .first()
      .click();
    if (addRoute) {
      cy.wait('@irisAbfahrten');
    }
  }
);

Cypress.Commands.add('closeModal', () => {
  cy.get('.MuiBackdrop-root').click({ force: true });
});
