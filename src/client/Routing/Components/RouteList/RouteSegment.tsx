import { Route$JourneySegment } from 'types/routing';
import JnySegmentTrain from './SegmentTrainComponent/JnySegmentTrain';
import Platform from 'Common/Components/Platform';
import React, { MouseEvent } from 'react';
import Time from 'Common/Components/Time';
import useStyles from './RouteSegment.style';
import WalkSegmentTrain from './SegmentTrainComponent/WalkSegmentTrain';

interface Props {
  segment: Route$JourneySegment;
  detail?: boolean;
  onTrainClick?: (e: MouseEvent) => void;
}

const RouteSegment = ({ segment, detail, onTrainClick }: Props) => {
  const classes = useStyles();

  return (
    <>
      <div className={classes.main}>
        <Time
          className={classes.departureTime}
          real={segment.departure.time}
          delay={segment.departure.delay}
        />
        <span className={classes.departureName}>
          {segment.segmentStart.title}
        </span>

        <Time
          className={classes.arrivalTime}
          real={segment.arrival.time}
          delay={segment.arrival.delay}
        />
        <span className={classes.arrivalName}>
          {segment.segmentDestination.title}
        </span>
        {segment.type === 'JNY' && (
          <>
            <Platform
              className={classes.departurePlatform}
              real={segment.departure.platform}
              scheduled={segment.departure.scheduledPlatform}
            />
            <Platform
              className={classes.arrivalPlatform}
              real={segment.arrival.platform}
              scheduled={segment.arrival.scheduledPlatform}
            />
          </>
        )}
        {segment.type === 'JNY' ? (
          <JnySegmentTrain
            className={classes.train}
            detail={detail}
            segment={segment}
            onTrainClick={onTrainClick}
          />
        ) : (
          <WalkSegmentTrain className={classes.train} segment={segment} />
        )}
      </div>
      {'changeDuration' in segment && (
        <span>{segment.changeDuration} Minuten Umsteigezeit</span>
      )}
    </>
  );
};

export default RouteSegment;
