describe('Abfahrten', () => {
	describe('generic', () => {
		beforeEach(() => {
			cy.mockDepartures({
				name: 'Frankfurt (Main) Hbf',
				evaNumber: '8000105',
				stopPlaceFixture: 'stopPlaceSearchFrankfurtHbf',
				departureFixture: 'abfahrtenFrankfurtHbf',
			});
		});
		it('open details', () => {
			cy.visit('/');
			cy.navigateToStation('Frankfurt (Main) Hbf');
			cy.findByTestId('abfahrtS35744').click();
			cy.findByTestId('abfahrtS35744').within(() => {
				cy.findByTestId('scrollMarker').should('exist');
			});
		});
		it('opened details should be rememberd on refresh', () => {
			cy.visit('/');
			cy.navigateToStation('Frankfurt (Main) Hbf');
			cy.findByTestId('abfahrtS35744').click();
			cy.findByTestId('abfahrtS35744').within(() => {
				cy.findByTestId('scrollMarker').should('exist');
			});
			cy.visit('/');
			cy.navigateToStation('Frankfurt (Main) Hbf');
			cy.findByTestId('abfahrtS35744').within(() => {
				cy.findByTestId('scrollMarker').should('exist');
			});
		});
		it('details should be closed if you open another', () => {
			cy.visit('/');
			cy.navigateToStation('Frankfurt (Main) Hbf');
			cy.findByTestId('abfahrtS35744').click();
			cy.findByTestId('abfahrtS35744').within(() => {
				cy.findByTestId('scrollMarker').should('exist');
			});

			cy.findByTestId('abfahrtRE4568').click();
			cy.findByTestId('abfahrtRE4568').within(() => {
				cy.findByTestId('scrollMarker').should('exist');
			});
			cy.findByTestId('abfahrtS35744').within(() => {
				cy.findByTestId('scrollMarker').should('not.exist');
			});
		});
	});
	it('going back & showing different station should reload', () => {
		cy.mockDepartures({
			name: 'Frankfurt (Main) Hbf',
			evaNumber: '8000105',
			stopPlaceFixture: 'stopPlaceSearchFrankfurtHbf',
			departureFixture: 'abfahrtenFrankfurtHbf',
			delay: 500,
		});
		cy.mockDepartures({
			name: 'Hamburg Hbf',
			evaNumber: '8002549',
			stopPlaceFixture: 'stopPlaceSearchHamburgHbf',
			departureFixture: 'abfahrtenHamburgHbf',
		});
		cy.visit('/');
		cy.navigateToStation('Frankfurt (Main) Hbf');
		cy.findByTestId('loading').should('exist');
		cy.findByTestId('lookahead').should('exist');
		cy.go('back');
		cy.navigateToStation('Hamburg Hbf');
		cy.findByTestId('loading').should('exist');
		cy.findByTestId('lookahead').should('exist');
	});
	it('cancelled not strike through', () => {
		cy.mockDepartures({
			name: 'Hamburg Hbf',
			evaNumber: '8002549',
			stopPlaceFixture: 'stopPlaceSearchHamburgHbf',
			departureFixture: 'abfahrtenHamburgHbf',
		});
		cy.visit('/');
		cy.navigateToStation('Hamburg Hbf');
		cy.findByTestId('abfahrtRB81616').within(() => {
			cy.findByTestId('cancelled').should(
				'not.have.css',
				'text-decoration-line',
				'line-through',
			);
			for (const id of ['destination', 'platform', 'timeContainer']) {
				cy.findByTestId(id).should(
					'have.css',
					'text-decoration-line',
					'line-through',
				);
			}
		});
		cy.percySnapshot('Abfahrten');
	});
	describe('wings', () => {
		it('2 wings displayed correctly', () => {
			cy.mockDepartures({
				stopPlaceFixture: 'stopPlace/byNameKarlsruhe',
				departureFixture: 'abfahrten/wings2',
				evaNumber: '8000191',
				name: 'Karlsruhe Hbf',
			});
			cy.visit('/');
			cy.navigateToStation('Karlsruhe Hbf');
			cy.findByTestId('wingIndicatorS85166').should('be.visible');
			cy.findByTestId('wingIndicatorS85266').should('be.visible');
			cy.percySnapshot();
		});

		it('3 wings displayed correctly', () => {
			cy.mockDepartures({
				stopPlaceFixture: 'stopPlace/byNameMünchen',
				departureFixture: 'abfahrten/wings3',
				evaNumber: '8000261',
				name: 'München Hbf',
			});
			cy.visit('/');
			cy.navigateToStation('München Hbf');
			cy.findByTestId('wingIndicatorBRB86797').should('be.visible');
			cy.findByTestId('wingIndicatorBRB87017').should('be.visible');
			cy.findByTestId('wingIndicatorBRB87037').should('be.visible');
			cy.percySnapshot();
		});

		it('4 wings displayed correctly', () => {
			cy.mockDepartures({
				stopPlaceFixture: 'stopPlace/byNameKarlsruhe',
				departureFixture: 'abfahrten/wings4',
				evaNumber: '8000191',
				name: 'Karlsruhe Hbf',
			});
			cy.visit('/');
			cy.navigateToStation('Karlsruhe Hbf');
			cy.findByTestId('wingIndicatorEC459').should('be.visible');
			cy.findByTestId('wingIndicatorEN40459').should('be.visible');
			cy.findByTestId('wingIndicatorNJ409').should('be.visible');
			cy.findByTestId('wingIndicatorIC60409').should('be.visible');
			cy.percySnapshot();
		});
	});
});
