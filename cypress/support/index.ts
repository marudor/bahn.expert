import './commands';

beforeEach(() => {
  cy.force404();
});

Cypress.Server.defaults({
  force404: true,
});
