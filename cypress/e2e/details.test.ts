describe('Details', () => {
	beforeEach(() => {
		cy.visit('/');
	});
	it('Can Render (with error)', () => {
		cy.trpc.journey.details(
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

	it('icon spins on reload', () => {
		cy.trpc.journey
			.details(
				{
					trainName: 'S30665',
				},
				{
					fixture: 'details/S6',
					delay: 1000,
				},
			)
			.as('details');
		cy.visit('/details/S30665');
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
		cy.trpc.journey
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
		cy.trpc.journey
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
		cy.percySnapshot();
	});

	it('uses journeyId if provided', () => {
		cy.trpc.journey
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
		cy.trpc.journey
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
		cy.trpc.journey
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

	describe('umläufe', () => {
		beforeEach(() => {
			cy.trpc.journey
				.details(
					{
						trainName: 'ICE720',
					},
					{
						fixture: 'details/ICE720',
					},
				)
				.as('details');
		});
		it('no Umlauf', () => {
			cy.visit('/details/ICE720');
			cy.wait('@details');
			cy.findAllByTestId('umlauf').should('not.exist');
		});

		it('next Umlauf', () => {
			cy.trpc.coachSequences
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
			cy.trpc.coachSequences.umlauf(
				{
					journeyId: '20240928-c25b8377-72f6-31b9-bc4c-e5fb374da779',
				},
				{
					fixture: 'sequence/ICE720Umlauf',
				},
			);
			cy.visit('/details/ICE720');
			cy.wait('@details');
			cy.findAllByTestId('umlauf')
				.should('have.length', 1)
				.and('include.text', 'ICE 727');
			cy.percySnapshot();
		});
	});
});
