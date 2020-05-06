import cc from 'clsx';
import stopPropagation from 'Common/stopPropagation';
import useStyles from './style';
import type { Route$JourneySegmentWalk } from 'types/routing';

interface Props {
  segment: Route$JourneySegmentWalk;
  className: string;
}

const WalkSegmentTrain = ({ segment, className }: Props) => {
  const classes = useStyles();

  const mapsLink = `https://www.google.com/maps/dir/?api=1&origin=${segment.segmentStart.coordinates.lat},${segment.segmentStart.coordinates.lng}&destination=${segment.segmentDestination.coordinates.lat},${segment.segmentDestination.coordinates.lng}&travelmode=walking`;

  return (
    <div className={className}>
      <div className={classes.trainInfo}>
        <span className={classes.trainMargin}>{segment.train.name}</span>
        <a
          onClick={stopPropagation}
          className={cc(classes.trainMargin, classes.destination)}
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

export default WalkSegmentTrain;
