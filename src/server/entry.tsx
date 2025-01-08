import { PassThrough, Transform, Writable } from 'node:stream';
import { createRouter } from '@/router';
import createEmotionCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import createEmotionServer from '@emotion/server/create-instance';
import type { AnyRouter } from '@tanstack/react-router';
import { getFullRouterManifest } from '@tanstack/start/router-manifest';
import { StartServer, createStartHandler } from '@tanstack/start/server';
import type { ReactElement } from 'react';
import { renderToPipeableStream, renderToString } from 'react-dom/server';
import { HeadProvider } from 'react-head';

export function transformStreamWithRouter(router: AnyRouter) {
	const callbacks = transformHtmlCallbacks(() =>
		router.injectedHtml.map((d) => d()).join(''),
	);
	return new Transform({
		transform(chunk, _encoding, callback) {
			callbacks
				.transform(chunk, this.push.bind(this))
				.then(() => callback())
				.catch((err) => callback(err));
		},
		flush(callback) {
			callbacks
				.flush(this.push.bind(this))
				.then(() => callback())
				.catch((err) => callback(err));
		},
	});
}

export function transformReadableStreamWithRouter(router: AnyRouter) {
	const callbacks = transformHtmlCallbacks(() =>
		router.injectedHtml.map((d) => d()).join(''),
	);

	const encoder = new TextEncoder();

	return new TransformStream<string>({
		transform(chunk, controller) {
			return callbacks.transform(chunk, (chunkToPush) => {
				controller.enqueue(encoder.encode(chunkToPush));
				return true;
			});
		},
		flush(controller) {
			return callbacks.flush((chunkToPush) => {
				controller.enqueue(chunkToPush);
				return true;
			});
		},
	});
}

// regex pattern for matching closing body and html tags
const patternBodyStart = /(<body)/;
const patternBodyEnd = /(<\/body>)/;
const patternHtmlEnd = /(<\/html>)/;

// regex pattern for matching closing tags
const pattern = /(<\/[a-zA-Z][\w:.-]*?>)/g;

const textDecoder = new TextDecoder();

function transformHtmlCallbacks(getHtml: () => string) {
	let bodyStarted = false;
	let leftover = '';
	// If a closing tag is split across chunks, store the HTML to add after it
	// This expects that all the HTML that's added is closed properly
	let leftoverHtml = '';

	return {
		// eslint-disable-next-line @typescript-eslint/require-await
		async transform(chunk: any, push: (chunkToPush: string) => boolean) {
			const chunkString = leftover + textDecoder.decode(chunk);

			const bodyStartMatch = chunkString.match(patternBodyStart);
			const bodyEndMatch = chunkString.match(patternBodyEnd);
			const htmlEndMatch = chunkString.match(patternHtmlEnd);

			try {
				if (bodyStartMatch) {
					bodyStarted = true;
				}

				if (!bodyStarted) {
					push(chunkString);
					leftover = '';
					return;
				}

				const html = getHtml();

				// If a </body></html> sequence was found
				if (
					bodyEndMatch &&
					htmlEndMatch &&
					bodyEndMatch.index! < htmlEndMatch.index!
				) {
					const bodyIndex = bodyEndMatch.index! + bodyEndMatch[0].length;
					const htmlIndex = htmlEndMatch.index! + htmlEndMatch[0].length;

					// Add the arbitrary HTML before the closing body tag
					const processed =
						chunkString.slice(0, bodyIndex) +
						html +
						chunkString.slice(bodyIndex, htmlIndex) +
						chunkString.slice(htmlIndex);

					push(processed);
					leftover = '';
				} else {
					// For all other closing tags, add the arbitrary HTML after them
					// biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
					let result;
					let lastIndex = 0;

					// biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
					while ((result = pattern.exec(chunkString)) !== null) {
						lastIndex = result.index + result[0].length;
					}

					// If a closing tag was found, add the arbitrary HTML and send it through
					if (lastIndex > 0) {
						const processed =
							chunkString.slice(0, lastIndex) + html + leftoverHtml;
						push(processed);
						leftover = chunkString.slice(lastIndex);
					} else {
						// If no closing tag was found, store the chunk to process with the next one
						leftover = chunkString;
						leftoverHtml += html;
					}
				}
			} catch (err) {
				console.error('Error transforming HTML:', err);
				throw err;
			}
		},
		// eslint-disable-next-line @typescript-eslint/require-await
		async flush(push: (chunkToPush: string) => boolean) {
			if (leftover) {
				push(leftover);
			}
		},
	};
}

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
	getRouterManifest: getFullRouterManifest,
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
		{
			onAllReady() {
				stream.pipe(passthrough);
			},
		},
	);

	const passthrough = new PassThrough();
	const transforms = [transformStreamWithRouter(router)];
	const transformedStream = transforms.reduce(
		(stream, transform) => (stream as any).pipe(transform),
		passthrough,
	);

	const writeStream = new StringStream();
	transformedStream.pipe(writeStream);

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
