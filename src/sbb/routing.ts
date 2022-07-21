import { format } from 'date-fns';
import { request } from './request';
import type { RoutingOptions, SBBRoutingResult } from 'sbb/types/routing';

export async function routing({
  start,
  destination,
  time = new Date(),
}: RoutingOptions): Promise<SBBRoutingResult> {
  const result = (
    await request.get<SBBRoutingResult>(
      `/unauth/fahrplanservice/v1/verbindungen/s/${start}/s/${destination}/ab/${format(
        time,
        'yyyy-MM-dd',
      )}/${format(time, 'HH-mm')}`,
      {
        params: {
          vonId: start,
          nachId: destination,
        },
      },
    )
  ).data;

  return result;
}
