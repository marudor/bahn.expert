import { eventHandler, getRequestURL } from 'vinxi/http';
import seoStationNames from './seoStations.json';

const sitemap = (baseUrl: string) => {
	let xml =
		'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

	for (const stationName of seoStationNames) {
		xml += `<url><loc>${baseUrl}/${encodeURIComponent(
			stationName,
		)}</loc><changefreq>always</changefreq></url>`;
	}

	xml += '</urlset>';

	return xml;
};

const robots = (baseUrl: string) => `User-agent: *
Allow: *

Sitemap: ${baseUrl}/sitemap.xml
`;

export default eventHandler((event) => {
	let response: Response | undefined;
	switch (event.path) {
		case '/sitemap.xml':
			response = new Response(sitemap(getRequestURL().origin), {
				headers: {
					'content-type': 'text/xml; charset=utf-8',
				},
			});
			break;
		case '/robots.txt':
			response = new Response(robots(getRequestURL().origin));
			break;
	}
	if (response) {
		event.respondWith(response);
	}
});
