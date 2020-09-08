import KoaRouter from '@koa/router';
import rawStations from 'db-stations/data.json';

const filterRegex = /(hbf|airport|flughafen)/i;
const router = new KoaRouter();
const sitemap = () => {
  let xml =
    '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

  rawStations
    .filter((s) => filterRegex.exec(s.name))
    .forEach((s) => {
      xml += `<url><loc>${global.BASE_URL}/${encodeURIComponent(
        s.name,
      )}</loc><changefreq>always</changefreq></url>`;
    });

  xml += '</urlset>';

  return xml;
};

const robots = () => `User-agent: *
Allow: *

Sitemap: ${global.BASE_URL}/sitemap.xml
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
