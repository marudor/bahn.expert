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

// VERY Ugly hack
const visit = cy.visit;
// @ts-expect-error ugly
cy.visit = (...args) => {
	// @ts-expect-error ugly
	visit(...args);
	cy.wait(500);
};

beforeEach(() => {
	cy.setCookie('timesPoliticSeen2', '200');
	cy.setCookie('timesFeedback', '200');
	cy.setCookie('bw2025', '200');
	cy.force404();
});
