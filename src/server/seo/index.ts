import { eventHandler } from 'vinxi/http';
import seoStationNames from './seoStations.json';

const sitemap = () => {
	let xml =
		'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

	for (const stationName of seoStationNames) {
		xml += `<url><loc>https://${import.meta.env.VITE_BASE_URL}/${encodeURIComponent(
			stationName,
		)}</loc><changefreq>always</changefreq></url>`;
	}

	xml += '</urlset>';

	return xml;
};

const robots = () => `User-agent: *
Allow: *

Sitemap: https://${import.meta.env.VITE_BASE_URL}/sitemap.xml
`;

export default eventHandler((event) => {
	let response: Response | undefined;
	switch (event.node.req.url) {
		case '/sitemap.xml':
			response = new Response(sitemap(), {
				headers: {
					'content-type': 'text/xml; charset=utf-8',
				},
			});
			break;
		case '/robots.txt':
			response = new Response(robots());
			break;
	}
	if (response) {
		event.respondWith(response);
	}
});
