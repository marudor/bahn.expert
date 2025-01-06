import { Writable } from 'node:stream';
import { createRouter } from '@/router';
import createEmotionCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import createEmotionServer from '@emotion/server/create-instance';
import { getRouterManifest } from '@tanstack/start/router-manifest';
import { StartServer, createStartHandler } from '@tanstack/start/server';
import type { ReactElement } from 'react';
import { renderToPipeableStream, renderToString } from 'react-dom/server';
import { HeadProvider } from 'react-head';

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

export default createStartHandler({
	createRouter,
	getRouterManifest,
})(async ({ router, responseHeaders }) => {
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
		`<!DOCTYPE html>${rawHtml.replace('<head>', `<head>${renderedHeadTags}${emotionStyleTags}`)}`,
		{
			status: router.hasNotFoundMatch() ? 404 : router.state.statusCode,
			headers: responseHeaders,
		},
	);
});
