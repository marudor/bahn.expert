import 'core-js/stable';

if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
	window.addEventListener('load', () => {
		navigator.serviceWorker
			.register('/service-worker.js')
			.then((registration) => {
				console.log('SW registered:', registration);
			})
			.catch((registrationError) => {
				console.log('SW registration failed:', registrationError);
			});
	});
}

if (typeof globalThis === 'undefined') {
	// @ts-expect-error polyfill
	// biome-ignore lint/suspicious/noGlobalAssign: <explanation>
	globalThis = global;
}

require('./index');
