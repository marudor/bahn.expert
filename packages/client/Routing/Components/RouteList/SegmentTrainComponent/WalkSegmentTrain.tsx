import { stopPropagation } from 'client/Common/stopPropagation';
import { useStyles } from './style';
import clsx from 'clsx';
import type { Route$JourneySegmentWalk } from 'types/routing';

interface Props {
  segment: Route$JourneySegmentWalk;
  className?: string;
}

export const WalkSegmentTrain = ({ segment, className }: Props) => {
  const classes = useStyles();
  const mapsLink = `https://www.google.com/maps/dir/?api=1&origin=${segment.segmentStart.coordinates.lat},${segment.segmentStart.coordinates.lng}&destination=${segment.segmentDestination.coordinates.lat},${segment.segmentDestination.coordinates.lng}&travelmode=walking`;

  return (
    <div className={className}>
      <div className={classes.info}>
        <span className={classes.margin}>{segment.train.name}</span>
        <a
          className={clsx(classes.margin, classes.destination)}
          onClick={stopPropagation}
          href={mapsLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          Maps Routing
        </a>
      </div>
    </div>
  );
};
