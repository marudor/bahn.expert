// @flow
import rawStations from 'db-stations/data.json';

export default () => {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

  rawStations.forEach(s => {
    xml += `<url><loc>https://marudor.de/${encodeURIComponent(s.name)}</loc></url>`;
  });

  xml += '</urlset>';

  return xml;
};
