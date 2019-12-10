import { Link } from 'react-router-dom';
import { Route$JourneySegmentTrain } from 'types/routing';
import AuslastungsDisplay from 'Common/Components/AuslastungsDisplay';
import cc from 'clsx';
import DetailsLink from 'Common/Components/Details/DetailsLink';
import React, { MouseEvent } from 'react';
import Reihung from 'Common/Components/Reihung';
import StopList from 'Routing/Components/RouteList/StopList';
import stopPropagation from 'Common/stopPropagation';
import useStyles from './style';

interface Props {
  segment: Route$JourneySegmentTrain;
  detail?: boolean;
  className: string;
  onTrainClick?: (e: MouseEvent) => void;
}
const JnySegmentTrain = ({
  segment,
  onTrainClick,
  className,
  detail,
}: Props) => {
  const classes = useStyles();

  return (
    <div onClick={onTrainClick} className={className}>
      <div className={classes.trainInfo}>
        <span className={cc(classes.trainMargin, classes.trainName)}>
          {segment.train.name}
          <DetailsLink
            train={segment.train}
            initialDeparture={segment.departure.scheduledTime}
          />
          <Link
            onClick={stopPropagation}
            to={`/details/${segment.train.type} ${segment.train.number}/${segment.departure.scheduledTime}`}
          >
            Details
          </Link>
        </span>
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
  );
};

export default JnySegmentTrain;
