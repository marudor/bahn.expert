import { axios } from './request';
import { format } from 'date-fns';
import { RoutingOptions } from 'types/SBB/routing';

export default async function Routing({
  start,
  destination,
  time = Date.now(),
}: RoutingOptions) {
  const result = (
    await axios.get(
      `/unauth/fahrplanservice/v1/verbindungen/s/${start}/s/${destination}/ab/${format(
        time,
        'yyyy-MM-dd'
      )}/${format(time, 'HH-mm')}`,
      {
        params: {
          vonId: start,
          nachId: destination,
        },
      }
    )
  ).data;

  return result;
}
