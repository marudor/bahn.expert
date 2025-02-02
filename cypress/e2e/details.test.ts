describe('Details', () => {
	beforeEach(() => {
		cy.force404();
	});
	it('Without Timestamp Redirects', () => {
		cy.request({
			url: '/details/ICE70',
			followRedirect: false,
		}).then((r) => {
			expect(r.status).to.equal(307);
			expect(r.redirectedToUrl).to.match(/details\/ICE70\/0$/);
		});
	});

	it('icon spins on reload', () => {
		cy.trpc.journeys
			.detailsByJourneyId('123', {
				fixture: 'details/S6',
				delay: 1000,
			})
			.as('details');
		cy.visit('/details/S30665/j/123');
		cy.findByTestId('loading').should('exist');
		cy.findByTestId('refreshIconLoading').should('be.visible');
		cy.findByTestId('refreshIcon').should('not.exist');
		cy.wait('@details');
		cy.findByTestId('loading').should('not.exist');
		cy.findByTestId('refreshIconLoading').should('not.exist');
		cy.findByTestId('refreshIcon').should('be.visible').click();
		cy.findByTestId('refreshIconLoading').should('be.visible');
		cy.findByTestId('loading').should('not.exist');
		cy.wait('@details');
		cy.findByTestId('loading').should('not.exist');
		cy.findByTestId('refreshIconLoading').should('not.exist');
	});

	it('can render & header height correct', () => {
		cy.trpc.journeys
			.detailsByJourneyId('123', {
				fixture: 'details/S6',
			})
			.as('details');
		cy.visit('/details/S30665/j/123');
		cy.wait('@details');
	});

	it('renders train line & number for regional stuff', () => {
		cy.trpc.journeys
			.detailsByJourneyId('123', {
				fixture: 'details/S6',
			})
			.as('details');
		cy.visit('/details/S30665/j/123');
		cy.wait('@details');
		cy.findByTestId('detailsTrainName').should('have.text', 'S 6 (30665)');
		cy.percySnapshot();
	});

	it('goes to next & sets administration', () => {
		cy.trpc.journeys
			.detailsByJourneyId('123', {
				times: 1,
				fixture: 'details/S6',
			})
			.as('details');
		cy.trpc.journeys
			.detailsByJourneyId('next', {
				fixture: 'details/ICE720',
			})
			.as('next');
		cy.trpc.journeys.find(
			{
				category: 'S',
				initialDepartureDate: new Date('2020-02-29T10:12:00.000Z'),
				trainNumber: 30665,
				withOEV: true,
				limit: 1,
			},
			{
				body: [
					{
						journeyId: 'next',
					},
				],
			},
		);
		cy.visit('/details/S30665/j/123');
		cy.wait('@details');
		cy.findByTestId('next').click();
		cy.url().should('contain', '/j/next');
	});

	// TODO: Not found for details overhaul
	it.skip('goes to previous & shows arrows even if unknown', () => {
		cy.trpc.journeys
			.detailsByJourneyId('123', {
				times: 1,
				fixture: 'details/S6',
			})
			.as('details');
		cy.visit('/details/S30665/j/123');
		cy.wait('@details');
		cy.findByTestId('previous').click();
		cy.url().should('contain', '2020-02-27');
		cy.findByTestId('error');
		cy.findByTestId('previous');
		cy.findByTestId('next');
	});

	describe('umläufe', () => {
		beforeEach(() => {
			cy.trpc.journeys
				.detailsByJourneyId('20240928-c25b8377-72f6-31b9-bc4c-e5fb374da779', {
					fixture: 'details/ICE720',
				})
				.as('details');
		});
		it('no Umlauf', () => {
			cy.visit(
				'/details/ICE720/j/20240928-c25b8377-72f6-31b9-bc4c-e5fb374da779',
			);
			cy.wait('@details');
			cy.findAllByTestId('umlauf').should('not.exist');
		});

		it('next Umlauf', () => {
			cy.trpc.coachSequence
				.sequence(
					{
						trainNumber: 720,
						category: 'ICE',
						evaNumber: '8000261',
					},
					{
						fixture: 'sequence/ICE720First',
					},
				)
				.as('firstSequence');
			cy.trpc.coachSequence.umlauf(
				{
					journeyId: '20240928-c25b8377-72f6-31b9-bc4c-e5fb374da779',
				},
				{
					fixture: 'sequence/ICE720Umlauf',
				},
			);
			cy.visit(
				'/details/ICE720/j/20240928-c25b8377-72f6-31b9-bc4c-e5fb374da779',
			);
			cy.wait('@details');
			cy.findAllByTestId('umlauf')
				.should('have.length', 1)
				.and('include.text', 'ICE 727');
			cy.percySnapshot();
		});
	});
});
