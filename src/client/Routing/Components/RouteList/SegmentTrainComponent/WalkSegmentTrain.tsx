import { Route$JourneySegmentWalk } from 'types/routing';
import React from 'react';
import useStyles from './style';

interface Props {
  segment: Route$JourneySegmentWalk;
  className: string;
}

const WalkSegmentTrain = ({ segment, className }: Props) => {
  const classes = useStyles();

  return (
    <div className={className}>
      <div className={classes.trainInfo}>
        <span className={classes.trainMargin}>{segment.train.name}</span>
      </div>
    </div>
  );
};

export default WalkSegmentTrain;
