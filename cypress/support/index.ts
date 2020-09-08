import './commands';

Cypress.Server.defaults({
  force404: true,
});
beforeEach(() => {
  cy.server();
});

Cypress.on('window:before:load', (win) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  delete win.fetch;
});
