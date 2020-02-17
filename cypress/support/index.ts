import './commands';
import '@cypress/code-coverage/support';

Cypress.Server.defaults({
  force404: true,
});
beforeEach(() => {
  cy.server();
});
