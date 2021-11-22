import Axios from 'axios';
import type { Request } from 'koa';

const url = process.env.PLAUSIBLE_URL;
const domain = process.env.ENVIRONMENT;

export function deprecatedAPIUsage(req: Request, name: string): void {
  if (!url || !domain) {
    return;
  }
  void Axios.post(
    url,
    {
      name,
      url: req.href,
      domain,
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
        'x-forwarded-for': (req.header['x-real-ip'] as string) || req.ip || '',
      },
    },
  );
}
