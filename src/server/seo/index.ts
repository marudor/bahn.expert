import KoaRouter from '@koa/router';
import seoStationNames from './seoStations.json';

const router = new KoaRouter();
const sitemap = () => {
	let xml =
		'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

	for (const stationName of seoStationNames) {
		xml += `<url><loc>${globalThis.BASE_URL}/${encodeURIComponent(
			stationName,
		)}</loc><changefreq>always</changefreq></url>`;
	}

	xml += '</urlset>';

	return xml;
};

const robots = () => `User-agent: *
Allow: *

Sitemap: ${globalThis.BASE_URL}/sitemap.xml
`;

router
	.get('/sitemap.xml', (ctx) => {
		ctx.body = sitemap();
		if (ctx.body) {
			ctx.set('Content-Type', 'text/xml; charset=utf-8');
		} else {
			ctx.status = 404;
		}
	})
	.get('/robots.txt', (ctx) => {
		ctx.body = robots();
		if (!ctx.body) {
			ctx.status = 404;
		}
	});

export default router.routes();
