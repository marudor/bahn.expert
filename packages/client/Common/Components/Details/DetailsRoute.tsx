import { Details } from 'client/Common/Components/Details';
import { useParams } from 'react-router';
import { useQuery } from 'client/Common/hooks/useQuery';
import type { FC } from 'react';

interface Props {
  urlPrefix?: string;
}

export const DetailsRoute: FC<Props> = ({ urlPrefix }) => {
  /**
   * If you change query params also change hafasDetailsRedirect.ts
   */
  const query = useQuery();
  const { train, initialDeparture } = useParams();

  return (
    <Details
      train={train!}
      stationId={(query.stopEva || query.station) as string}
      initialDeparture={initialDeparture}
      currentStopId={query.stop as string}
      urlPrefix={urlPrefix}
    />
  );
};
// eslint-disable-next-line import/no-default-export
export default DetailsRoute;
