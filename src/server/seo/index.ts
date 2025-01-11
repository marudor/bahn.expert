import { eventHandler } from 'vinxi/http';
import seoStationNames from './seoStations.json';

const sitemap = (baseUrl: string) => {
	let xml =
		'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

	for (const stationName of seoStationNames) {
		xml += `<url><loc>https://${baseUrl}/${encodeURIComponent(
			stationName,
		)}</loc><changefreq>always</changefreq></url>`;
	}

	xml += '</urlset>';

	return xml;
};

const robots = (baseUrl: string) => `User-agent: *
Allow: *

Sitemap: https://${baseUrl}/sitemap.xml
`;

export default eventHandler((event) => {
	let response: Response | undefined;
	switch (event.node.req.url) {
		case '/sitemap.xml':
			response = new Response(sitemap(new URL(event.node.req.url!).host), {
				headers: {
					'content-type': 'text/xml; charset=utf-8',
				},
			});
			break;
		case '/robots.txt':
			response = new Response(robots(new URL(event.node.req.url!).host));
			break;
	}
	if (response) {
		event.respondWith(response);
	}
});
