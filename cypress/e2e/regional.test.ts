describe('Regional', () => {
	it('can navigate to Details Page', () => {
		cy.trpc.stopPlace.byName(
			{
				searchTerm: 'Poststraße, Karlsruhe',
			},
			{
				fixture: 'regional/stopPlaceSearchPoststrasse',
			},
		);
		cy.trpc.hafas.irisAbfahrten(
			{
				evaNumber: '0723869',
			},
			{ fixture: 'regional/departurePostStrasse' },
		);
		cy.trpc.journeys.details(
			{
				trainName: 'STR 1761',
				evaNumberAlongRoute: '723870',
				initialDepartureDate: new Date('2020-05-02T17:54:00.000Z'),
			},
			{ fixture: 'regional/detailsStr1761' },
		);
		cy.visit('/');
		cy.findByTestId('navToggle').click();
		cy.findByTestId('regional').click();
		cy.navigateToStation('Poststraße, Karlsruhe');
		cy.findByTestId('abfahrtSTR1761').click();
		cy.findByTestId('abfahrtSTR1761').findByTestId('detailsLink').click();
		cy.findByTestId('8079041').within(() => {
			cy.get('a').should(
				'have.attr',
				'href',
				'/regional/Karlsruhe%20Bahnhofsvorplatz',
			);
		});
	});

	it('can handle slashes', () => {
		cy.trpc.stopPlace.byName(
			{
				searchTerm: 'Arndt-/Spittastraße, Stuttgart',
			},
			{ fixture: 'regional/stopPlaceSearchArndtSpittastrasse' },
		);
		cy.trpc.hafas.irisAbfahrten(
			{
				evaNumber: '0369218',
			},
			{ fixture: 'regional/departureArndtSpittastrasse' },
		);
		cy.visit('/');
		cy.findByTestId('navToggle').click();
		cy.findByTestId('regional').click();
		cy.navigateToStation('Arndt-/Spittastraße, Stuttgart');
		cy.findByTestId('abfahrtSTB77629');
	});
});
