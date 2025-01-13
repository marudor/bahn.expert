import type { Server } from 'node:http';
import type { FC, PropsWithChildren } from 'react';

declare global {
	declare namespace globalThis {
		declare var adminServer: Server | undefined;
		declare var DISRUPTION: string | undefined;

		// test only
		declare var nock: nock.Scope;
	}

	interface Navigator {
		standalone?: boolean;
	}
	type Falsy = false | 0 | '' | null | undefined | void;
	interface Array<T> {
		filter<S extends T>(
			predicate: BooleanConstructor,
			thisArg?: any,
		): Exclude<S, Falsy>[];
	}
	type E<T extends const> = T[keyof T];
	// biome-ignore lint/complexity/noBannedTypes: <explanation>
	type FCC<Props = {}> = FC<PropsWithChildren<Props>>;
}
