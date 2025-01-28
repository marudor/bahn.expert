import { Auslastung } from '@/client/Abfahrten/Components/Abfahrt/Auslastung';
import { AbfahrtProvider } from '@/client/Abfahrten/provider/AbfahrtProvider';
import rawMockAbfahrt from '@/fixtures/mockAbfahrtAuslastung.json';
import type { Abfahrt } from '@/types/iris';

const mockAbfahrt = globalThis.parseJson<Abfahrt>(
	JSON.stringify(rawMockAbfahrt),
);

describe('Auslastung', () => {
	const renderAuslastung = () => {
		cy.mount(
			<AbfahrtProvider abfahrt={mockAbfahrt} detail={false}>
				<Auslastung />
			</AbfahrtProvider>,
		);
		return mockAbfahrt;
	};

	it('shows auslastung no loading', () => {
		cy.trpc.journeys
			.find(
				{
					trainNumber: 2326,
					category: 'IC',
					initialDepartureDate: new Date('2019-09-08T12:28:00.000Z'),
				},
				{
					body: [
						{
							jid: 'found',
						},
					],
				},
			)
			.as('find');
		cy.trpc.hafas
			.occupancy(
				{
					trainNumber: mockAbfahrt.train.number,
					stopEva: mockAbfahrt.currentStopPlace.evaNumber,
					journeyId: 'found',
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
		cy.findByTestId('loading').should('not.exist');
		cy.wait('@auslastung');
		cy.findByTestId('auslastungDisplay').should('exist');
	});
});
