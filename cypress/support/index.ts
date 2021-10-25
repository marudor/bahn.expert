import './commands';
import '@percy/cypress';

beforeEach(() => {
  cy.force404();
});

Cypress.Server.defaults({
  force404: true,
});
