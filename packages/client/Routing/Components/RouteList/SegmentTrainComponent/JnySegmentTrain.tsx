import { AuslastungsDisplay } from 'client/Common/Components/AuslastungsDisplay';
import { DetailsLink } from 'client/Common/Components/Details/DetailsLink';
import { PlannedType } from 'client/Common/Components/PlannedType';
import { Reihung } from 'client/Common/Components/Reihung';
import { StopList } from 'client/Routing/Components/RouteList/StopList';
import { useStyles } from './style';
import clsx from 'clsx';
import type { MouseEvent } from 'react';
import type { Route$JourneySegmentTrain } from 'types/routing';

interface Props {
  segment: Route$JourneySegmentTrain;
  detail?: boolean;
  className?: string;
  onTrainClick?: (e: MouseEvent) => void;
}
export const JnySegmentTrain = ({
  segment,
  onTrainClick,
  className,
  detail,
}: Props) => {
  const classes = useStyles();
  return (
    <div onClick={onTrainClick} className={className}>
      <div className={classes.info}>
        <span className={classes.margin}>
          <span>
            {segment.train.name}{' '}
            {segment.plannedSequence && (
              <PlannedType plannedSequence={segment.plannedSequence} />
            )}
          </span>
        </span>
        <span className={clsx(classes.margin, classes.destination)}>
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
