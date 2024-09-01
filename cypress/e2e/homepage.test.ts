describe('Homepage', () => {
	beforeEach(() => {
		cy.visit('/');
		// Waiting becuase hydration might now have hapened yet
		cy.wait(50);
	});

	const currentKölnCookie =
		'%7B%228000105%22%3A%7B%22name%22%3A%22K%C3%B6ln%20Hbf%22%2C%22evaNumber%22%3A%228000105%22%7D%7D';

	describe('Themes', () => {
		it('dark', () => {
			cy.theme('dark');
			cy.get('body').should('have.css', 'background-color', 'rgb(48, 48, 48)');
			cy.percySnapshot('dark theme');
		});

		it('light', () => {
			cy.theme('light');
			cy.get('body').should(
				'have.css',
				'background-color',
				'rgb(250, 250, 250)',
			);
			cy.percySnapshot('light theme');
		});
	});

	it('Favorite', () => {
		cy.findByTestId('noFav').should('be.visible');
		cy.mockFrankfurt();
		cy.navigateToStation('Frankfurt (Main) Hbf');
		cy.findByTestId('menu').click();
		cy.findByTestId('toggleFav').click();
		cy.findByTestId('menu').click();
		cy.findByTestId('toggleFav').should('include.text', 'Unfav');
		cy.visit('/');
		cy.findByTestId('favEntry').should('have.text', 'Frankfurt (Main) Hbf');
	});

	it('Shows error on mainPage', () => {
		cy.trpc.iris.abfahrten(
			{
				evaNumber: '8000105',
			},
			{
				statusCode: 500,
				delayMs: 500,
			},
		);
		cy.trpc.stopPlace.byName(
			{
				searchTerm: 'Frankfurt (Main) Hbf',
			},
			{
				fixture: 'stopPlaceSearchFrankfurtHbf',
			},
		);
		cy.visit('/');
		cy.navigateToStation('Frankfurt (Main) Hbf');
		cy.findByTestId('loading').should('exist');
		cy.findByTestId('error').should('exist');
	});

	it('shows favs from cookie', () => {
		cy.setCookie('favs', currentKölnCookie);
		cy.visit('/');
		cy.findByTestId('favEntry').should('have.text', 'Köln Hbf');
	});
});
