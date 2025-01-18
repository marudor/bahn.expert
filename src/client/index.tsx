import { createRouter, hydrateRouter } from '@/router';
import createEmotionCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { StartClient } from '@tanstack/start';
import { hydrateRoot } from 'react-dom/client';
import { HeadProvider } from 'react-head';

const cache = createEmotionCache({ prepend: true, key: 'css' });
const router = createRouter();
hydrateRouter();

async function render() {
	await router.load();

	hydrateRoot(
		document!,
		<HeadProvider>
			<CacheProvider value={cache}>
				<StartClient router={router} />
			</CacheProvider>
		</HeadProvider>,
	);
}

if (import.meta.env.DEV) {
	render();
} else {
	window.addEventListener('load', render);
}
