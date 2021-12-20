import './commands';
import '@percy/cypress';

beforeEach(() => {
  cy.force404();
  cy.setCookie('theme', 'dark');
});

Cypress.Server.defaults({
  force404: true,
});
