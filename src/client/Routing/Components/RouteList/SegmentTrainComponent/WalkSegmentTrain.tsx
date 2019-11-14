import { Route$JourneySegmentWalk } from 'types/routing';
import cc from 'clsx';
import React from 'react';
import stopPropagation from 'Common/stopPropagation';
import useStyles from './style';

interface Props {
  segment: Route$JourneySegmentWalk;
  className: string;
}

const WalkSegmentTrain = ({ segment, className }: Props) => {
  const classes = useStyles();

  const mapsLink = `https://www.openstreetmap.org/directions?engine=graphhopper_foot&route=${segment.segmentStart.coordinates.lat}%2C${segment.segmentStart.coordinates.lng}%3B${segment.segmentDestination.coordinates.lat}%2C${segment.segmentDestination.coordinates.lng}`;

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
