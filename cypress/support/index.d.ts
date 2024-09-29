import type {} from 'cypress/types/net-stubbing';

interface MockOptions {
	lookahead?: number;
	lookbehind?: number;
	startTime?: Date;
	delay?: number;
}

interface MockStopPlaceOptions {
	lookbehind?: number;
	lookahead?: number;
	delay?: number;
	name: string;
	stopPlaceFixture: string;
	departureFixture: string;
	startTime?: Date;
	evaNumber: string;
}
declare global {
	namespace Cypress {
		interface Chainable<Subject = any> {
			/**
			 * Custom command to select DOM element by data-cy attribute.
			 * @example cy.dataCy('greeting')
			 */
			navigateToStation(
				value: string,
				options?: {
					findPrefix?: string;
				},
			): void;
			closeModal(): void;
			mockDepartures(options: MockStopPlaceOptions): void;
			openSettings(): void;
			force404(): void;
			theme(type: string): void;
		}
	}
}
