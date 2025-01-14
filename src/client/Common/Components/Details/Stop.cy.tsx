import { Stop } from '@/client/Common/Components/Details/Stop';
import type { CommonStopInfo } from '@/types/stopPlace';
import type { PropsFor } from '@mui/system';

describe('Stop', () => {
	type StopType = PropsFor<typeof Stop>['stop'];
	const baseStop = {
		station: {
			evaNumber: 'test',
			name: 'test',
		},
	} satisfies StopType;

	const baseStopInfo: CommonStopInfo = {
		scheduledTime: new Date(),
		time: new Date(),
	};

	function getStopWithArrDep(
		departure?: Partial<CommonStopInfo>,
		arrival?: Partial<CommonStopInfo>,
	): StopType {
		return {
			...baseStop,
			departure: departure
				? {
						...baseStopInfo,
						...departure,
					}
				: undefined,
			arrival: arrival
				? {
						...baseStopInfo,
						...arrival,
					}
				: undefined,
		};
	}

	it('departure & arrival exists, same, not cancelled', () => {
		cy.mount(
			<Stop
				stop={getStopWithArrDep(
					{
						platform: '1',
						scheduledPlatform: '1',
					},
					{
						platform: '1',
						scheduledPlatform: '1',
					},
				)}
			/>,
		);
		cy.findByTestId('departurePlatform')
			.should('be.visible')
			.should('have.text', '1')
			.should('not.have.css', 'text-decoration-line', 'line-through');
		cy.findByTestId('arrivalPlatform').should('not.exist');
	});

	it('departure & arrival exists, same, arrival cancelled', () => {
		cy.mount(
			<Stop
				stop={getStopWithArrDep(
					{
						platform: '1',
						scheduledPlatform: '1',
					},
					{
						platform: '1',
						scheduledPlatform: '1',
						cancelled: true,
					},
				)}
			/>,
		);
		cy.findByTestId('departurePlatform')
			.should('be.visible')
			.should('have.text', '1')
			.should('not.have.css', 'text-decoration-line', 'line-through');
		cy.findByTestId('arrivalPlatform').should('not.exist');
	});

	it('departure & arrival exists, same, departure cancelled', () => {
		cy.mount(
			<Stop
				stop={getStopWithArrDep(
					{
						platform: '1',
						scheduledPlatform: '1',
						cancelled: true,
					},
					{
						platform: '1',
						scheduledPlatform: '1',
					},
				)}
			/>,
		);
		cy.findByTestId('departurePlatform')
			.should('be.visible')
			.should('have.text', '1')
			.should('not.have.css', 'text-decoration-line', 'line-through');
		cy.findByTestId('arrivalPlatform').should('not.exist');
	});

	it('departure & arrival exists, different, not cancelled', () => {
		cy.mount(
			<Stop
				stop={getStopWithArrDep(
					{
						platform: '1',
						scheduledPlatform: '1',
					},
					{
						platform: '2',
						scheduledPlatform: '2',
					},
				)}
			/>,
		);
		cy.findByTestId('departurePlatform')
			.should('be.visible')
			.should('have.text', '1')
			.should('not.have.css', 'text-decoration-line', 'line-through');
		cy.findByTestId('arrivalPlatform')
			.should('be.visible')
			.should('have.text', '2')
			.should('not.have.css', 'text-decoration-line', 'line-through');
	});

	it('departure without arrival, not cancelled', () => {
		cy.mount(
			<Stop
				stop={getStopWithArrDep({
					platform: '1',
					scheduledPlatform: '1',
				})}
			/>,
		);
		cy.findByTestId('departurePlatform')
			.should('be.visible')
			.should('have.text', '1')
			.should('not.have.css', 'text-decoration-line', 'line-through');
		cy.findByTestId('arrivalPlatform').should('not.exist');
	});

	it('arrival without departure, not cancelled', () => {
		cy.mount(
			<Stop
				stop={getStopWithArrDep(undefined, {
					platform: '1',
					scheduledPlatform: '1',
				})}
			/>,
		);
		cy.findByTestId('departurePlatform')
			.should('be.visible')
			.should('have.text', '1')
			.should('not.have.css', 'text-decoration-line', 'line-through');
		cy.findByTestId('arrivalPlatform').should('not.exist');
	});

	it('departure without arrival, cancelled', () => {
		cy.mount(
			<Stop
				stop={getStopWithArrDep({
					platform: '1',
					scheduledPlatform: '1',
					cancelled: true,
				})}
			/>,
		);
		cy.findByTestId('departurePlatform')
			.should('be.visible')
			.should('have.text', '1')
			.should('have.css', 'text-decoration-line', 'line-through');
		cy.findByTestId('arrivalPlatform').should('not.exist');
	});

	it('arrival without departure, cancelled', () => {
		cy.mount(
			<Stop
				stop={getStopWithArrDep(undefined, {
					platform: '1',
					scheduledPlatform: '1',
					cancelled: true,
				})}
			/>,
		);
		cy.findByTestId('departurePlatform')
			.should('be.visible')
			.should('have.text', '1')
			.should('have.css', 'text-decoration-line', 'line-through');
		cy.findByTestId('arrivalPlatform').should('not.exist');
	});

	it('departure & arrival exists, different, both cancelled', () => {
		cy.mount(
			<Stop
				stop={getStopWithArrDep(
					{
						platform: '1',
						scheduledPlatform: '1',
						cancelled: true,
					},
					{
						platform: '2',
						scheduledPlatform: '2',
						cancelled: true,
					},
				)}
			/>,
		);
		cy.findByTestId('departurePlatform')
			.should('be.visible')
			.should('have.text', '1')
			.should('have.css', 'text-decoration-line', 'line-through');
		cy.findByTestId('arrivalPlatform')
			.should('be.visible')
			.should('have.text', '2')
			.should('have.css', 'text-decoration-line', 'line-through');
	});

	it('departure & arrival exists, different, arrival cancelled', () => {
		cy.mount(
			<Stop
				stop={getStopWithArrDep(
					{
						platform: '1',
						scheduledPlatform: '1',
					},
					{
						platform: '2',
						scheduledPlatform: '2',
						cancelled: true,
					},
				)}
			/>,
		);
		cy.findByTestId('departurePlatform')
			.should('be.visible')
			.should('have.text', '1')
			.should('not.have.css', 'text-decoration-line', 'line-through');
		cy.findByTestId('arrivalPlatform')
			.should('be.visible')
			.should('have.text', '2')
			.should('have.css', 'text-decoration-line', 'line-through');
	});

	it('departure & arrival exists, different, departure cancelled', () => {
		cy.mount(
			<Stop
				stop={getStopWithArrDep(
					{
						platform: '1',
						scheduledPlatform: '1',
						cancelled: true,
					},
					{
						platform: '2',
						scheduledPlatform: '2',
					},
				)}
			/>,
		);
		cy.findByTestId('departurePlatform')
			.should('be.visible')
			.should('have.text', '1')
			.should('have.css', 'text-decoration-line', 'line-through');
		cy.findByTestId('arrivalPlatform')
			.should('be.visible')
			.should('have.text', '2')
			.should('not.have.css', 'text-decoration-line', 'line-through');
	});
});
