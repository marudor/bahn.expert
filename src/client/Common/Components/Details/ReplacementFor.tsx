import { TransportName } from '@/client/Common/Components/Details/TransportName';
import type { FC } from 'react';
import type { TransportPublicDestinationOriginJourney } from '@/external/generated/risJourneys';

interface Props {
  startsReplacing?: TransportPublicDestinationOriginJourney[];
  stopsReplacing?: TransportPublicDestinationOriginJourney[];
  stopEva: string;
}

export const ReplacementFor: FC<Props> = ({
  startsReplacing,
  stopsReplacing,
  stopEva,
}) => {
  const starts = startsReplacing?.map((j) => (
    <span key={j.journeyID}>
      Ersatz für <TransportName transport={j} />
    </span>
  ));
  const stops = stopsReplacing?.map((j) => {
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
