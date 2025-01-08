import { createRouter } from '@/router';
import createEmotionCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { StartClient } from '@tanstack/start';
import { hydrateRoot } from 'react-dom/client';
import { HeadProvider } from 'react-head';

const router = createRouter();
const cache = createEmotionCache({ prepend: true, key: 'css' });

window.onload = async () => {
	await router.load();

	hydrateRoot(
		document!,
		<HeadProvider>
			<CacheProvider value={cache}>
				<StartClient router={router} />
			</CacheProvider>
		</HeadProvider>,
	);
};
