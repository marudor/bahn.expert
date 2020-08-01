import { Destination, TrainInfo, TrainMargin } from './common';
import { stopPropagation } from 'client/Common/stopPropagation';
import type { Route$JourneySegmentWalk } from 'types/routing';

interface Props {
  segment: Route$JourneySegmentWalk;
  className?: string;
}

const A = Destination.withComponent('a');

export const WalkSegmentTrain = ({ segment, className }: Props) => {
  const mapsLink = `https://www.google.com/maps/dir/?api=1&origin=${segment.segmentStart.coordinates.lat},${segment.segmentStart.coordinates.lng}&destination=${segment.segmentDestination.coordinates.lat},${segment.segmentDestination.coordinates.lng}&travelmode=walking`;

  return (
    <div className={className}>
      <TrainInfo>
        <TrainMargin>{segment.train.name}</TrainMargin>
        <A
          onClick={stopPropagation}
          href={mapsLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          Maps Routing
        </A>
      </TrainInfo>
    </div>
  );
};
