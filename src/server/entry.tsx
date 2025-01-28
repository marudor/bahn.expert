import { Writable } from 'node:stream';
import { createRouter } from '@/router';
import createEmotionCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import createEmotionServer from '@emotion/server/create-instance';
import { getFullRouterManifest } from '@tanstack/start/router-manifest';
import { StartServer, createStartHandler } from '@tanstack/start/server';
import type { ReactElement } from 'react';
import { renderToPipeableStream, renderToString } from 'react-dom/server';
import { HeadProvider } from 'react-head';
import { eventHandler } from 'vinxi/http';

class StringStream extends Writable {
	#buffer = '';
	#prom: Promise<string>;
	#resolve: (val: string) => void = () => {};
	constructor() {
		super();
		// biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
		this.#prom = new Promise<string>((resolve) => (this.#resolve = resolve));
	}
	_write(
		chunk: Buffer | string,
		_encoding: BufferEncoding,
		callback: (error?: Error | null) => void,
	): void {
		this.#buffer += chunk.toString();
		callback(null);
	}
	_final(callback: (error?: Error | null) => void): void {
		this.#resolve(this.#buffer);
		callback(null);
	}
	read() {
		return this.#prom;
	}
}

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
	const emotionCache = createEmotionCache({ prepend: true, key: 'css' });
	const { extractCriticalToChunks, constructStyleTagsFromChunks } =
		createEmotionServer(emotionCache);

	const headTags: ReactElement[] = [];

	// VERY Ugly hack due to emotion. Have to get rid of it...
	const stream = renderToPipeableStream(
		<HeadProvider headTags={headTags}>
			<CacheProvider value={emotionCache}>
				<StartServer router={router} />
			</CacheProvider>
		</HeadProvider>,
	);

	const writeStream = new StringStream();
	stream.pipe(writeStream);

	const rawHtml = await writeStream.read();

	const emotionStyles = extractCriticalToChunks(rawHtml);
	const emotionStyleTags = constructStyleTagsFromChunks(emotionStyles);
	const renderedHeadTags = renderToString(headTags);

	return new Response(
		`<!DOCTYPE html>${rawHtml.replace('<head>', `<head>${emotionStyleTags}`)}`,
		// .replace('<title>', '<title data-rh="">')}`,
		{
			status: router.hasNotFoundMatch() ? 404 : router.state.statusCode,
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
