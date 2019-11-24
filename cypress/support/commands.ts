import '@testing-library/cypress/add-commands';

Cypress.Commands.add(
  'navigateToStation',
  (value: string, isStubbed: boolean = true) => {
    cy.server();
    if (!isStubbed) {
      cy.route(/\/api\/iris\/v1\/abfahrten.*/).as('irisAbfahrten');
    }
    cy.findByTestId('stationSearchInput').type(value);
    cy.findAllByTestId('stationSearchMenuItem')
      .first()
      .click();
    if (!isStubbed) {
      cy.wait('@irisAbfahrten');
    }
  }
);

Cypress.Commands.add('closeModal', () => {
  cy.get('.MuiBackdrop-root').click({ force: true });
});

Cypress.Commands.add(
  'mockFrankfurt',
  ({ lookbehind = 0, lookahead = 150 } = {}) => {
    cy.server();
    cy.route(
      `/api/iris/v1/abfahrten/8098105?lookahead=${lookahead}&lookbehind=${lookbehind}`,
      'fixture:abfahrtenFrankfurtHbf.json'
    ).route(
      '/api/station/v1/search/Frankfurt (Main) Hbf?type=default',
      'fixture:stationSearchFrankfurtHbf.json'
    );
  }
);

Cypress.Commands.add('getAbfahrtenConfig', () => {
  return cy
    .getCookie('config')
    .should('exist')
    .then(c => {
      if (!c) throw new Error("can' happen");
      const config = JSON.parse(decodeURIComponent(c.value));

      return cy.wrap(config);
    });
});

Cypress.Commands.add('openSettings', () => {
  cy.findByTestId('menu').click();
  cy.findByTestId('openSettings').click();
});
