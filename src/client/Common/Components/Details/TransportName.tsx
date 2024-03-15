import { DetailsLink } from '@/client/Common/Components/Details/DetailsLink';
import type { FC } from 'react';
import type {
  TransportPublicDestinationOriginJourney,
  TransportPublicDestinationPortionWorking,
} from '@/external/generated/risJourneys';

interface Props {
  transport:
    | TransportPublicDestinationPortionWorking
    | TransportPublicDestinationOriginJourney;
}

export const TransportName: FC<Props> = ({ transport }) => {
  return (
    <DetailsLink
      train={{
        number: transport.number.toString(),
        type: transport.category,
      }}
      initialDeparture={new Date()}
      journeyId={transport.journeyID}
    >
      {transport.category}{' '}
      {transport.line
        ? `${transport.line} (${transport.number})`
        : transport.number}
    </DetailsLink>
  );
};
