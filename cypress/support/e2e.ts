import './commands';
import '@percy/cypress';

beforeEach(() => {
  cy.force404();
  cy.setCookie('theme', 'dark');
});
