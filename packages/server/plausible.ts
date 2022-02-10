import Axios from 'axios';
import type { Context, Request } from 'koa';
import type { RouterParamContext } from '@koa/router';

const plausibleUrl = process.env.PLAUSIBLE_URL;
const environment = process.env.ENVIRONMENT;

export async function deprecatedAPIUsage(
  req: Request,
  name: string,
): Promise<void> {
  try {
    if (!plausibleUrl || !environment) {
      return;
    }
    await Axios.post(
      plausibleUrl,
      {
        name,
        url: req.href,
        domain: environment,
        referrer: req.header.referer,
        props: {
          userAgent: req.header['user-agent'],
          ip: req.header['x-real-ip'],
          userAgentIp: `${req.header['x-real-ip']}: ${req.header['user-agent']}`,
        },
      },
      {
        headers: {
          'user-agent': req.header['user-agent']! || '',
          'x-forwarded-for':
            (req.header['x-real-ip'] as string) || req.ip || '',
        },
      },
    );
  } catch {
    //ignore errors
  }
}

export async function apiUsage(
  ctx: Context & RouterParamContext,
): Promise<void> {
  const route = ctx._matchedRoute?.toString();
  const req = ctx.request;
  const res = ctx.response;
  try {
    if (!plausibleUrl || !route || !environment) {
      return;
    }
    const domain =
      environment === 'production' ? 'marudor.de' : 'beta.marudor.de';
    const isMarudorTraffic = req.header.referer?.startsWith(
      `https://${domain}`,
    );
    const utmMedium = isMarudorTraffic ? 'marudor' : 'external';

    const url = `${req.protocol}://${req.host}${route}?utm_source=api&utm_medium=${utmMedium}`;

    await Axios.post(
      plausibleUrl,
      {
        name: 'pageview',
        url,
        domain,
        referrer: req.header.referer,
        props: {
          userAgent: req.header['user-agent'],
          ip: req.header['x-real-ip'],
          statusCode: res.status,
        },
      },
      {
        headers: {
          'user-agent': req.header['user-agent']! || '',
          'x-forwarded-for':
            (req.header['x-real-ip'] as string) || req.ip || '',
        },
      },
    );
  } catch {
    // ignore errors
  }
}
