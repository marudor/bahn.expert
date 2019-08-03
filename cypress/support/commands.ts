import '@testing-library/cypress/add-commands';

Cypress.Commands.add('navigateToStation', (value: string) => {
  cy.server();
  cy.route(/\/api\/iris\/current\/abfahrten.*/).as('irisAbfahrten');
  cy.getByTestId('stationSearchInput').type(value);
  cy.getAllByTestId('stationSearchMenuItem')
    .first()
    .click();
  cy.wait('@irisAbfahrten');
});
