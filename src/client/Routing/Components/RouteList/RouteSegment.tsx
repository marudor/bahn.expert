import { Route$JourneySegment } from 'types/routing';
import AuslastungsDisplay from 'Common/Components/AuslastungsDisplay';
import cc from 'clsx';
import Platform from 'Common/Components/Platform';
import React, { useMemo } from 'react';
import Reihung from 'Common/Components/Reihung';
import StopList from './StopList';
import Time from 'Common/Components/Time';
import useStyles from './RouteSegment.style';

type OwnProps = {
  segment: Route$JourneySegment;
  detail?: boolean;
  onTrainClick: () => void;
};
type Props = OwnProps;
const RouteSegment = ({ segment, detail, onTrainClick }: Props) => {
  const classes = useStyles();
  const train = useMemo(
    () => (
      <div
        onClick={e => {
          e.preventDefault();
          e.stopPropagation();
          onTrainClick();
        }}
        className={classes.train}
      >
        <div className={classes.trainInfo}>
          <span className={classes.trainMargin}>{segment.train.name}</span>
          <span className={cc(classes.trainMargin, classes.destination)}>
            {segment.finalDestination}
          </span>
          {segment.auslastung && (
            <AuslastungsDisplay auslastung={segment.auslastung} />
          )}
        </div>
        {detail && (
          <>
            {segment.departure.reihung && segment.train.number && (
              <Reihung
                className={classes.reihung}
                useZoom
                fahrzeugGruppe={false}
                trainNumber={segment.train.number}
                currentStation={segment.segmentStart.title}
                scheduledDeparture={segment.departure.scheduledTime}
              />
            )}
            <StopList stops={segment.stops} />
          </>
        )}
      </div>
    ),
    [classes, segment, detail, onTrainClick]
  );

  return (
    <>
      <div className={cc(classes.main)}>
        <Time real={segment.departure.time} delay={segment.departure.delay} />
        <span>{segment.segmentStart.title}</span>
        <Platform
          real={segment.departure.platform}
          scheduled={segment.departure.scheduledPlatform}
        />
        {train}
        <Time real={segment.arrival.time} delay={segment.arrival.delay} />
        <span>{segment.segmentDestination.title}</span>
        <Platform
          real={segment.arrival.platform}
          scheduled={segment.arrival.scheduledPlatform}
        />
      </div>
      {segment.hasOwnProperty('changeDuration') && (
        <span>{segment.changeDuration} Minuten Umsteigezeit</span>
      )}
    </>
  );
};

export default RouteSegment;
