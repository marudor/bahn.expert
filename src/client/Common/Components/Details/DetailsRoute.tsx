import { Details } from '@/client/Common/Components/Details';
import { DetailsProvider } from '@/client/Common/provider/DetailsProvider';
import { useParams } from 'react-router';
import { useQuery } from '@/client/Common/hooks/useQuery';
import type { FC } from 'react';

interface Props {
  urlPrefix?: string;
}

export const DetailsRoute: FC<Props> = ({ urlPrefix }) => {
  const query = useQuery();
  const { train, initialDeparture } = useParams();
  const evaNumberAlongRoute = (query.evaNumberAlongRoute ||
    query.stopEva ||
    query.station) as string | undefined;

  return (
    <DetailsProvider
      trainName={train!}
      evaNumberAlongRoute={evaNumberAlongRoute}
      initialDepartureDateString={initialDeparture}
      urlPrefix={urlPrefix}
      journeyId={query.journeyId as string | undefined}
      administration={query.administration as string | undefined}
    >
      <Details />
    </DetailsProvider>
  );
};
// eslint-disable-next-line import/no-default-export
export default DetailsRoute;
