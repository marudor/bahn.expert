import { TransportName } from '@/client/Common/Components/Details/TransportName';
import type { FC } from 'react';
import type { TransportPublicDestinationPortionWorking } from '@/external/generated/risJourneys';

interface Props {
  joinsWith?: TransportPublicDestinationPortionWorking[];
  splitsWith?: TransportPublicDestinationPortionWorking[];
  stopEva: string;
}

export const TravelsWith: FC<Props> = ({ joinsWith, splitsWith, stopEva }) => {
  const joins = joinsWith?.map((j) => (
    <span key={j.journeyID}>
      Vereinigung mit <TransportName transport={j} />
    </span>
  ));
  const splits = splitsWith?.map((j) => {
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
      {joins}
      {splits}
    </>
  );
};
