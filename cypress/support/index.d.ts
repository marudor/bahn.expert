import type {
	RouteMatcherOptions,
	StaticResponseWithOptions,
} from 'cypress/types/net-stubbing';

interface MockOptions {
	lookahead?: number;
	lookbehind?: number;
	startTime?: Date;
	delay?: number;
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
			mockFrankfurt(options?: MockOptions): void;
			mockHamburg(options?: MockOptions): void;
			mockHannover(options?: MockOptions): void;
			openSettings(): void;
			force404(): void;
			theme(type: string): void;
			trpcFixture(fixtureName: string): Chainable<any>;
			trpcIntercept(
				matcherOptions: Omit<RouteMatcherOptions, 'query'> & {
					query: any;
					pathname: string;
				},
				handler: StaticResponseWithOptions,
			): ReturnType<typeof cy.intercept>;
		}
	}
}
