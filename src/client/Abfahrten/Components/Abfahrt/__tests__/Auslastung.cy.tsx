import { Auslastung } from '@/client/Abfahrten/Components/Abfahrt/Auslastung';
import { AbfahrtContext } from '@/client/Abfahrten/Components/Abfahrt/BaseAbfahrt';
import rawMockAbfahrt from '@/fixtures/mockAbfahrtAuslastung.json';
import type { Abfahrt } from '@/types/iris';

const mockAbfahrt = globalThis.parseJson<Abfahrt>(
	JSON.stringify(rawMockAbfahrt),
);

describe('Auslastung', () => {
	const renderAuslastung = () => {
		cy.mount(<Auslastung />, {
			context: [
				{
					...AbfahrtContext,
					initialState: { abfahrt: mockAbfahrt, detail: false },
				},
			],
		});
		return mockAbfahrt;
	};

	it('shows loading first, nothing on error', () => {
		cy.trpc.hafas.occupancy(
			{},
			{
				delay: 200,
				statusCode: 404,
			},
		);
		renderAuslastung();
		cy.findByTestId('auslastungDisplay').should('not.exist');
		cy.findByTestId('loading').should('exist');
		cy.wait('@auslastung');
		cy.findByTestId('loading').should('not.exist');
		cy.findByTestId('auslastungDisplay').should('not.exist');
	});

	it('shows auslastung after loading', () => {
		cy.trpc.hafas
			.occupancy(
				{
					start: mockAbfahrt.currentStopPlace.name,
					destination: mockAbfahrt.destination,
					trainNumber: mockAbfahrt.train.number,
					plannedDepartureTime: mockAbfahrt.departure!.scheduledTime,
					stopEva: mockAbfahrt.currentStopPlace.evaNumber,
				},
				{
					delay: 200,
					body: {
						source: 'test',
						occupancy: {
							first: 1,
							second: 2,
						},
					},
				},
			)
			.as('auslastung');

		renderAuslastung();
		cy.findByTestId('loading').should('exist');
		cy.wait('@auslastung');
		cy.findByTestId('auslastungDisplay').should('exist');
	});
});
