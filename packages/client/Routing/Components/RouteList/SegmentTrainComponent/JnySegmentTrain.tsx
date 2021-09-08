import { AuslastungsDisplay } from 'client/Common/Components/AuslastungsDisplay';
import { DetailsLink } from 'client/Common/Components/Details/DetailsLink';
import { PlannedType } from 'client/Common/Components/PlannedType';
import { Reihung } from 'client/Common/Components/Reihung';
import { StopList } from 'client/Routing/Components/RouteList/StopList';
import { Tooltip } from '@material-ui/core';
import { useStyles } from './style';
import clsx from 'clsx';
import type { FC, MouseEvent } from 'react';
import type { Route$JourneySegmentTrain } from 'types/routing';

interface Props {
  segment: Route$JourneySegmentTrain;
  detail?: boolean;
  className?: string;
  onTrainClick?: (e: MouseEvent) => void;
}
export const JnySegmentTrain: FC<Props> = ({
  segment,
  onTrainClick,
  className,
  detail,
}) => {
  const classes = useStyles();

  const tooltipTitle =
    segment.train.number &&
    segment.train.number &&
    (segment.train.name.endsWith(segment.train.number)
      ? `Linie ${segment.train.line}`
      : `Nummer ${segment.train.number}`);

  return (
    <div onClick={onTrainClick} className={className}>
      <div className={classes.info}>
        <span className={classes.margin}>
          <span>
            <Tooltip title={tooltipTitle ?? segment.train.name}>
              <span>
                {segment.train.name}{' '}
                {segment.plannedSequence && (
                  <PlannedType plannedSequence={segment.plannedSequence} />
                )}
              </span>
            </Tooltip>
          </span>
        </span>
        <span className={clsx(classes.margin, classes.destination)}>
          {segment.finalDestination}
          <DetailsLink
            train={segment.train}
            evaNumber={segment.segmentStart.id}
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
              currentEvaNumber={segment.segmentStart.id}
              trainType={segment.train.type}
              scheduledDeparture={segment.departure.scheduledTime}
            />
          )}
          <StopList stops={segment.stops} />
        </>
      )}
    </div>
  );
};
