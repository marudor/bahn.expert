import { createRouter } from '@/router';
import createEmotionCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import createEmotionServer from '@emotion/server/create-instance';
import { getFullRouterManifest } from '@tanstack/start/router-manifest';
import { StartServer, createStartHandler } from '@tanstack/start/server';
import type { ReactElement } from 'react';
import { renderToString } from 'react-dom/server';
import { HeadProvider } from 'react-head';
import { eventHandler } from 'vinxi/http';

const SSRHandler = createStartHandler({
	createRouter,
	getRouterManifest: getFullRouterManifest,
})(async ({ router, responseHeaders }) => {
	if (responseHeaders.has('location')) {
		return new Response(undefined, {
			status: router.state.statusCode,
			headers: responseHeaders,
		});
	}
	const emotionCache = createEmotionCache({ key: 'css' });
	const { extractCriticalToChunks, constructStyleTagsFromChunks } =
		createEmotionServer(emotionCache);

	const headTags: ReactElement[] = [];

	const rawHtml = renderToString(
		<HeadProvider headTags={headTags}>
			<CacheProvider value={emotionCache}>
				<StartServer router={router} />
			</CacheProvider>
		</HeadProvider>,
	);
	const injectedHtml = (
		await Promise.all(router.serverSsr?.injectedHtml ?? [])
	).join('');

	const emotionStyles = extractCriticalToChunks(rawHtml);
	const emotionStyleTags = constructStyleTagsFromChunks(emotionStyles);

	return new Response(
		`<!DOCTYPE html>${rawHtml.replace('<head>', `<head>${emotionStyleTags}`).replace('</body>', `${injectedHtml}</body>`)}`,
		{
			status: router.state.statusCode,
			headers: responseHeaders,
		},
	);
});

const invalidPathEndings = ['.map', '.ico', '.js'];
export default eventHandler((event) => {
	if (invalidPathEndings.some((ending) => event.path.endsWith(ending))) {
		return event.respondWith(
			new Response(null, {
				status: 404,
			}),
		);
	}
	return SSRHandler(event);
});
