import './commands';
import '@percy/cypress';

Cypress.on('uncaught:exception', (err) => {
	if (
		/hydrat/i.test(err.message) ||
		/Minified React error #418/.test(err.message) ||
		/Minified React error #423/.test(err.message)
	) {
		return false;
	}
});

beforeEach(() => {
	cy.force404();
	cy.setCookie('timesPoliticSeen2', '200');
	cy.setCookie('timesFeedback', '200');
});
