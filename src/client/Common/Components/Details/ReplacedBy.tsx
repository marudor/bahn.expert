import { TransportName } from '@/client/Common/Components/Details/TransportName';
import type { FC } from 'react';
import type { TransportPublicDestinationOriginJourney } from '@/external/generated/risJourneys';

interface Props {
  startsBeingReplacedBy?: TransportPublicDestinationOriginJourney[];
  stopsBeingReplacedBy?: TransportPublicDestinationOriginJourney[];
  stopEva: string;
}

export const ReplacedBy: FC<Props> = ({
  startsBeingReplacedBy,
  stopsBeingReplacedBy,
  stopEva,
}) => {
  const starts = startsBeingReplacedBy?.map((j) => (
    <span key={j.journeyID}>
      Ersetzt durch <TransportName transport={j} />
    </span>
  ));
  const stops = stopsBeingReplacedBy?.map((j) => {
    if (
      stopEva ===
      (j.differingDestination?.evaNumber || j.destination?.evaNumber)
    ) {
      return (
        <span key={j.journeyID}>
          <TransportName transport={j} /> endet in{' '}
          {j.differingDestination?.name || j.destination?.name}
        </span>
      );
    }
    return (
      <span key={j.journeyID}>
        <TransportName transport={j} /> fährt weiter nach{' '}
        {j.differingDestination?.name || j.destination?.name}
      </span>
    );
  });

  return (
    <>
      {starts}
      {stops}
    </>
  );
};
