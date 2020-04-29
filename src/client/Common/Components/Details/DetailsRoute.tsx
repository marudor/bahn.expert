import { RouteComponentProps } from 'react-router';
import Details from 'Common/Components/Details';
import useQuery from 'Common/hooks/useQuery';

interface Props
  extends RouteComponentProps<{
    train: string;
    initialDeparture?: string;
  }> {}

const DetailsRoute = ({
  match: {
    params: { train, initialDeparture },
  },
}: Props) => {
  const query = useQuery();

  return (
    <Details
      train={train}
      stationId={query.station}
      initialDeparture={initialDeparture}
      currentStopId={query.stop}
    />
  );
};

export default DetailsRoute;
