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

// VERY UGLY - find out why cy.visit doesn't wait for hydration
Cypress.on('command:end', (e) => {
	if (e.attributes.name === 'visit') {
		cy.wait(50);
		// @ts-expect-error ugly
		cy.window().then((w) => w.__TSR__ROUTER__.load());
		cy.wait(50);
	}
});

beforeEach(() => {
	cy.force404();
	cy.setCookie('timesPoliticSeen2', '200');
	cy.setCookie('timesFeedback', '200');
});
