function openFilter() {
	cy.findByTestId('menu').click();
	cy.findByTestId('openFilter').click();
}

describe('Filter', () => {
	beforeEach(() => {
		cy.mockFrankfurt();
	});
	it('Type Filter Temporary', () => {
		cy.visit('/');
		cy.navigateToStation('Frankfurt (Main) Hbf');
		cy.findByTestId('abfahrtS35744').should('exist');
		openFilter();
		cy.findByTestId('filterS').click();
		cy.closeModal();
		cy.findByTestId('abfahrtS35744').should('not.exist');
		cy.visit('/');
		cy.navigateToStation('Frankfurt (Main) Hbf');
		cy.findByTestId('abfahrtS35744').should('exist');
	});

	it('Type Filter default', () => {
		cy.visit('/');
		cy.navigateToStation('Frankfurt (Main) Hbf');
		cy.findByTestId('abfahrtS35744').should('exist');
		openFilter();
		cy.findByTestId('filterS').click();
		cy.findByTestId('filterSubmit').click();
		cy.findByTestId('abfahrtS35744').should('not.exist');
		cy.visit('/');
		cy.navigateToStation('Frankfurt (Main) Hbf');
		cy.findByTestId('abfahrtS35744').should('not.exist');
	});

	it('onlyDepartures', () => {
		cy.visit('/');
		cy.navigateToStation('Frankfurt (Main) Hbf');
		cy.findByTestId('abfahrtICE1632').should('exist');
		cy.visit('/?onlyDepartures=true');
		cy.navigateToStation('Frankfurt (Main) Hbf');
		cy.findByTestId('abfahrtICE1632').should('not.exist');
	});

	it('showCancelled', () => {
		cy.visit('/');
		cy.navigateToStation('Frankfurt (Main) Hbf');
		cy.findByTestId('abfahrtRB15663').should('exist');
		cy.openSettings();
		cy.findByTestId('showCancelled').click();
		cy.closeModal();
		cy.findByTestId('abfahrtRB15663').should('not.exist');
		cy.mockFrankfurt();
		cy.navigateToStation('Frankfurt (Main) Hbf');
		cy.findByTestId('abfahrtRB15663').should('not.exist');
	});
});
