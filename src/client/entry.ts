import 'core-js/stable';

if (typeof globalThis === 'undefined') {
	// @ts-expect-error polyfill
	// biome-ignore lint/suspicious/noGlobalAssign: <explanation>
	globalThis = global;
}

require('./index');
