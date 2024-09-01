describe('Details', () => {
	beforeEach(() => {
		cy.visit('/');
	});
	it('Can Render (with error)', () => {
		cy.trpc.journeys.details(
			{
				trainName: 'ICE70',
			},
			{
				statusCode: 404,
			},
		);
		cy.visit('/details/ICE70');
		cy.findByTestId('error')
			.should('exist')
			.should('have.text', 'Unbekannter Zug');
	});

	it('can render & header height correct', () => {
		cy.trpc.journeys
			.details(
				{
					trainName: 'S30665',
				},
				{
					fixture: 'details/S6',
				},
			)
			.as('details');
		cy.visit('/details/S30665');
		cy.wait('@details');
	});

	it('renders train line & number for regional stuff', () => {
		cy.trpc.journeys
			.details(
				{
					trainName: 'S30665',
				},
				{
					fixture: 'details/S6',
				},
			)
			.as('details');
		cy.visit('/details/S30665');
		cy.wait('@details');
		cy.findByTestId('detailsTrainName').should('have.text', 'S 6 (30665)');
	});

	it('uses journeyId if provided', () => {
		cy.trpc.journeys
			.details(
				{
					trainName: 'S30665',
					journeyId: 'jid',
				},
				{
					fixture: 'details/S6',
				},
			)
			.as('details');
		cy.visit('/details/S30665?journeyId=jid');
		cy.wait('@details');
		cy.findByTestId('detailsTrainName').should('have.text', 'S 6 (30665)');
	});

	it('goes to next & sets administration', () => {
		cy.trpc.journeys
			.details(
				{
					trainName: 'S30665',
				},
				{
					times: 1,
					fixture: 'details/S6',
				},
			)
			.as('details');
		cy.visit('/details/S30665');
		cy.wait('@details');
		cy.findByTestId('next').click();
		cy.url()
			.should('contain', '2020-02-29')
			.should('contain', 'administration=800337');
	});

	it('goes to previous & shows arrows even if unknown', () => {
		cy.trpc.journeys
			.details(
				{
					trainName: 'S30665',
				},
				{
					times: 1,
					fixture: 'details/S6',
				},
			)
			.as('details');
		cy.visit('/details/S30665');
		cy.wait('@details');
		cy.findByTestId('previous').click();
		cy.url().should('contain', '2020-02-27');
		cy.findByTestId('error');
		cy.findByTestId('previous');
		cy.findByTestId('next');
	});
});
