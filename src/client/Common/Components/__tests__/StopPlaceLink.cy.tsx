import { StopPlaceLink } from '@/client/Common/Components/StopPlaceLink';

describe('StationLink', () => {
	it('renders anchor for stationName', () => {
		cy.mount(
			<StopPlaceLink
				stopPlace={{
					name: 'test',
				}}
			/>,
		);

		cy.findByTestId('stationLink')
			.should('have.attr', 'href', '/test')
			.should('have.text', 'test');
	});
});
