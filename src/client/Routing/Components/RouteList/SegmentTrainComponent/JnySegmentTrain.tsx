import AuslastungsDisplay from 'Common/Components/AuslastungsDisplay';
import cc from 'clsx';
import DetailsLink from 'Common/Components/Details/DetailsLink';
import PlannedType from 'Common/Components/PlannedType';
import Reihung from 'Common/Components/Reihung';
import StopList from 'Routing/Components/RouteList/StopList';
import useStyles from './style';
import type { MouseEvent } from 'react';
import type { Route$JourneySegmentTrain } from 'types/routing';

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
        <span className={classes.trainMargin}>
          <span>
            {segment.train.name}{' '}
            {segment.plannedSequence && (
              <PlannedType plannedSequence={segment.plannedSequence} />
            )}
          </span>
        </span>
        <span className={cc(classes.trainMargin, classes.destination)}>
          {segment.finalDestination}
          <DetailsLink
            train={segment.train}
            stationId={segment.segmentStart.id}
            initialDeparture={segment.departure.scheduledTime}
          />
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
