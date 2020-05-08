import Details from 'Common/Components/Details';
import useQuery from 'Common/hooks/useQuery';
import type { RouteComponentProps } from 'react-router';

interface Props
  extends RouteComponentProps<{
    train: string;
    initialDeparture?: string;
  }> {
  urlPrefix?: string;
}

const DetailsRoute = ({
  match: {
    params: { train, initialDeparture },
  },
  urlPrefix,
}: Props) => {
  const query = useQuery();

  return (
    <Details
      train={train}
      stationId={query.station as string}
      initialDeparture={initialDeparture}
      currentStopId={query.stop as string}
      urlPrefix={urlPrefix}
    />
  );
};

export default DetailsRoute;
