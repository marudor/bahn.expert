describe('Details', () => {
	beforeEach(() => {
		cy.visit('/');
	});
	it('Can Render (with error)', () => {
		cy.visit('/details/ICE70');
		cy.findByTestId('error')
			.should('exist')
			.should('have.text', 'Unbekannter Zug');
	});

	it('can render & header height correct', () => {
		cy.trpcIntercept(
			{
				pathname: '/rpc/journeys.details',
				query: {
					trainName: 'S30665',
				},
			},
			{
				fixture: 'details/S6',
			},
		).as('details');
		cy.visit('/details/S30665');
		cy.wait('@details');
	});

	it('renders train line & number for regional stuff', () => {
		cy.trpcIntercept(
			{
				pathname: '/rpc/journeys.details',
				query: {
					trainName: 'S30665',
				},
			},
			{
				fixture: 'details/S6',
			},
		).as('details');
		cy.visit('/details/S30665');
		cy.wait('@details');
		cy.findByTestId('detailsTrainName').should('have.text', 'S 6 (30665)');
	});

	it('uses journeyId if provided', () => {
		cy.trpcIntercept(
			{
				pathname: '/rpc/journeys.details',
				query: {
					trainName: 'S30665',
					journeyId: 'jid',
				},
			},
			{
				fixture: 'details/S6',
			},
		).as('details');
		cy.visit('/details/S30665?journeyId=jid');
		cy.wait('@details');
		cy.findByTestId('detailsTrainName').should('have.text', 'S 6 (30665)');
	});

	it('goes to next & sets administration', () => {
		cy.trpcIntercept(
			{
				pathname: '/rpc/journeys.details',
				query: {
					trainName: 'S30665',
				},
				times: 1,
			},
			{
				fixture: 'details/S6',
			},
		).as('details');
		cy.visit('/details/S30665');
		cy.wait('@details');
		cy.findByTestId('next').click();
		cy.url()
			.should('contain', '2020-02-29')
			.should('contain', 'administration=800337');
	});

	it('goes to previous & shows arrows even if unknown', () => {
		cy.trpcIntercept(
			{
				pathname: '/rpc/journeys.details',
				query: {
					trainName: 'S30665',
				},
				times: 1,
			},
			{
				fixture: 'details/S6',
			},
		).as('details');
		cy.visit('/details/S30665');
		cy.wait('@details');
		cy.findByTestId('previous').click();
		cy.url().should('contain', '2020-02-27');
		cy.findByTestId('error');
		cy.findByTestId('previous');
		cy.findByTestId('next');
	});
});
