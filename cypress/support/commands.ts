import '@testing-library/cypress/add-commands';

Cypress.Commands.add(
  'navigateToStation',
  (value: string, addRoute: boolean = true) => {
    cy.server();
    if (addRoute) {
      cy.route(/\/api\/iris\/current\/abfahrten.*/).as('irisAbfahrten');
    }
    cy.findByTestId('stationSearchInput').type(value);
    cy.findAllByTestId('stationSearchMenuItem')
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

Cypress.Commands.add('mockFrankfurt', () => {
  cy.server();
  cy.route(
    '/api/station/current/search/Frankfurt (Main) Hbf?type=0',
    'fixture:stationSearchFrankfurtHbf.json'
  ).route(
    '/api/iris/current/abfahrten/8098105?lookahead=150&lookbehind=0',
    'fixture:abfahrtenFrankfurtHbf.json'
  );
});
