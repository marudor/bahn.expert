import './commands';
import '@percy/cypress';

beforeEach(() => {
	cy.force404();
	cy.setCookie('timesPoliticSeen2', '200');
	cy.setCookie('timesFeedback', '200');
});
