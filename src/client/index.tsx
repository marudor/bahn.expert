import { createRouter } from '@/router';
import createEmotionCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { StartClient } from '@tanstack/start';
import { hydrateRoot } from 'react-dom/client';
import { HeadProvider } from 'react-head';

const cache = createEmotionCache({ key: 'css' });
const router = createRouter();

async function preloadSSRMatches() {
	for (const match of router.matchRoutes(router.state.location)) {
		// @ts-expect-error
		await router.loadRouteChunk(router.routesById[match.routeId]);
	}
}

async function render() {
	await preloadSSRMatches();
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
