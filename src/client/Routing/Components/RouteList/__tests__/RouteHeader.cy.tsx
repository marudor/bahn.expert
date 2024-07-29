import { RouteHeader } from '@/client/Routing/Components/RouteList/RouteHeader';

describe('RouteHeader', () => {
	it('renders date in header', () => {
		cy.mount(<RouteHeader date={new Date('2019-10-19T00:00:00.000Z')} />);
		cy.findByTestId('headerDate').should('have.text', '19.10.2019');
	});
});
