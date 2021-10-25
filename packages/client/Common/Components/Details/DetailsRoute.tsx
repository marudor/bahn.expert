import { Details } from 'client/Common/Components/Details';
import { useQuery } from 'client/Common/hooks/useQuery';
import type { FC } from 'react';
import type { RouteComponentProps } from 'react-router';

interface Props
  extends RouteComponentProps<{
    train: string;
    initialDeparture?: string;
  }> {
  urlPrefix?: string;
}

export const DetailsRoute: FC<Props> = ({
  match: {
    params: { train, initialDeparture },
  },
  urlPrefix,
}) => {
  /**
   * If you change query params also change hafasDetailsRedirect.ts
   */
  const query = useQuery();

  return (
    <Details
      train={train}
      stationId={(query.stopEva || query.station) as string}
      initialDeparture={initialDeparture}
      currentStopId={query.stop as string}
      urlPrefix={urlPrefix}
    />
  );
};
// eslint-disable-next-line import/no-default-export
export default DetailsRoute;
