describe('CoachSequence', () => {
	describe('Frankfurt Hbf', () => {
		beforeEach(() => {
			cy.mockDepartures({
				name: 'Frankfurt (Main) Hbf',
				evaNumber: '8000105',
				stopPlaceFixture: 'stopPlaceSearchFrankfurtHbf',
				departureFixture: 'abfahrtenFrankfurtHbf',
			});
			cy.visit('/');
			cy.trpc.coachSequence.sequence(
				{
					evaNumber: '8000105',
					departure: new Date('2019-08-07T12:50:00.000Z'),
					initialDeparture: new Date('2019-08-07T07:46:00.000Z'),
					trainNumber: 371,
					category: 'ICE',
				},
				{
					fixture: 'sequence/genericICE1',
				},
			);
			cy.navigateToStation('Frankfurt (Main) Hbf');
			cy.findByTestId('abfahrtICE371').click();
		});

		it('loads coachSequence', () => {
			cy.findByTestId('coachSequence')
				.should('exist')
				.within(() => {
					cy.findByTestId('direction')
						.should('exist')
						.within(() => {
							cy.findByTestId('left').should('exist');
						});
				});
		});

		it('Legend useable', () => {
			cy.findByTestId('coachSequenceLegendOpener').click();
			cy.findByTestId('coachSequenceLegend').should('exist');
			cy.closeModal();
			cy.findByTestId('coachSequence').should('exist');
		});

		it('Sitzplatzinfo', () => {
			cy.findByTestId('coachSequenceCoach11').within(() => {
				cy.findByTestId('sitzplatzinfoToggle').click();
			});
			cy.findByTestId('sitzplatzinfoComfort').should('exist');
			cy.closeModal();
			cy.findByTestId('coachSequenceCoach7').within(() => {
				cy.findByTestId('sitzplatzinfoToggle').click();
			});
			cy.findByTestId('sitzplatzinfoComfort').should('exist');
			cy.findByTestId('sitzplatzinfoDisabled').should('exist');
		});
	});

	describe('Hannover Hbf', () => {
		beforeEach(() => {
			cy.mockDepartures({
				name: 'Hannover Hbf',
				evaNumber: '8000152',
				stopPlaceFixture: 'stopPlaceSearchHannoverHbf',
				departureFixture: 'abfahrtenHannoverHbf',
			});
			cy.visit('/');
			cy.navigateToStation('Hannover Hbf');
			cy.trpc.coachSequence
				.sequence(
					{
						evaNumber: '8000152',
						departure: new Date('2020-02-22T11:26:00.000Z'),
						initialDeparture: new Date('2020-02-22T10:15:00.000Z'),
						trainNumber: 537,
						category: 'ICE',
					},
					{
						fixture: 'sequence/537Wing',
					},
				)
				.as('537');
			cy.trpc.coachSequence
				.sequence(
					{
						trainNumber: 587,
						category: 'ICE',
						evaNumber: '8000152',
						departure: new Date('2020-02-22T11:26:00.000Z'),
						initialDeparture: new Date('2020-02-22T10:15:00.000Z'),
					},
					{
						statusCode: 404,
					},
				)
				.as('587');
		});
		it('only loads coachSequence of selected train if available', () => {
			cy.findByTestId('abfahrtICE537').click();
			cy.wait('@537');
			cy.findByTestId('direction').within(() => {
				cy.findByTestId('left').should('exist');
			});
		});

		it('fallback to wing number', () => {
			cy.findByTestId('abfahrtICE587').click();
			cy.wait('@587');
			cy.wait('@537');
		});
	});
});
