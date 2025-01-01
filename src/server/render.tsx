import { Writable } from 'node:stream';
import { createRouter } from '@/router';
import createEmotionCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import createEmotionServer from '@emotion/server/create-instance';
import { StartServer, createRequestHandler } from '@tanstack/start/server';
import type { Context } from 'koa';
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

export async function render({
	ctx,
}: {
	ctx: Context;
}) {
	// Convert the express request to a fetch request
	const url = new URL(ctx.originalUrl || ctx.url, 'https://localhost:3000')
		.href;
	const request = new Request(url, {
		method: ctx.method,
		headers: (() => {
			const headers = new Headers();
			for (const [key, value] of Object.entries(ctx.headers)) {
				headers.set(key, value as any);
			}
			return headers;
		})(),
	});

	let router: ReturnType<typeof createRouter>;
	// Create a request handler
	const handler = createRequestHandler({
		request,
		createRouter: () => {
			router = createRouter(ctx.request.storage, ctx.url);
			return router;
		},
	});

	// Let's use the default stream handler to create the response
	const response = await handler(async ({ router, responseHeaders }) => {
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

	response.headers.forEach((value, name) => {
		ctx.set(name, value);
	});

	ctx.body = await response.text();

	ctx.message = response.statusText;
	ctx.status = response.status;
}

// export default (ctx: Context): void => {
// 	const emotionCache = createEmotionCache({ key: 'css', prepend: true });
// 	const { extractCriticalToChunks, constructStyleTagsFromChunks } =
// 		createEmotionServer(emotionCache);
// 	const selectedDetail = ctx.query.selectedDetail;

// 	if (selectedDetail && typeof selectedDetail === 'string') {
// 		ctx.request.storage.set('selectedDetail', selectedDetail);
// 	}

// 	sanitizeStorage(ctx.request.storage);

// 	const headTags: any = [];
// 	const App = (
// 		<ServerBaseComponent
// 			headTags={headTags}
// 			url={ctx.url}
// 			storage={ctx.request.storage}
// 			emotionCache={emotionCache}
// 		/>
// 	);

// 	const app = renderToString(App);
// 	const emotionStyles = extractCriticalToChunks(app);
// 	const emotionStyleTags = constructStyleTagsFromChunks(emotionStyles);
// 	ctx.body = headerTemplate({
// 		withStats: process.env.NODE_ENV === 'production' && !process.env.TEST_RUN,
// 		header: renderToString(headTags),
// 		// cssTags: extractor.getStyleTags(),
// 		// linkTags: extractor.getLinkTags(),
// 		imprint: JSON.stringify(globalThis.IMPRINT),
// 		emotionCss: emotionStyleTags,
// 		baseUrl: globalThis.BASE_URL,
// 		rawBaseUrl: globalThis.RAW_BASE_URL,
// 		disruption: globalThis.DISRUPTION,
// 	});
// 	ctx.body += app;

// 	// ctx.body += footerTemplate({
// 	// 	scriptTags: extractor.getScriptTags(),
// 	// });
// };
