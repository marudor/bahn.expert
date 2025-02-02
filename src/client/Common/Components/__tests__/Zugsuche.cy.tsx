import { Zugsuche } from '@/client/Common/Components/Zugsuche';

describe('Zugsuche', () => {
	const dummyTrigger = (toggleModal: any) => (
		<div onClick={toggleModal} data-testid="dummytoggle">
			toggle
		</div>
	);

	const renderZugsuche = () =>
		cy.mount(<Zugsuche>{dummyTrigger}</Zugsuche>, { withNavigation: true });

	it('renders children', () => {
		renderZugsuche();
		cy.findByTestId('dummytoggle').should('be.visible');
	});

	it('closed by default', () => {
		renderZugsuche();
		cy.findByTestId('Zugsuche').should('not.exist');
	});

	it('can be opened', () => {
		renderZugsuche();
		cy.findByTestId('dummytoggle').click();
		cy.findByTestId('Zugsuche').should('be.visible');
	});

	it('Navigates to details', () => {
		const journeyId = 'ee7b2fbd-1370-4585-8108-22938c252836';
		cy.trpc.journeys.find(
			{
				trainNumber: 6,
			},
			{
				body: [
					{
						journeyId,
						train: { name: 'EC 6', type: 'EC', number: '6' },
						stops: [],
						firstStop: {
							station: { evaNumber: '6000', name: 'Interlaken Ost' },
						},
						lastStop: { station: { evaNumber: '8000050', name: 'Bremen Hbf' } },
					},
				],
			},
		);
		renderZugsuche();

		cy.findByTestId('dummytoggle').click();
		cy.findByTestId('zugsucheAutocompleteInput').type('6');
		cy.findByTestId('zugsucheAutocompleteItem').click();
		cy.findByTestId('Zugsuche').should('not.exist');
		cy.location('pathname').should(
			'include',
			encodeURI(`/details/EC 6/j/${journeyId}`),
		);
	});
});
