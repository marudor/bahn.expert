import { AuslastungsDisplay } from '@/client/Common/Components/AuslastungsDisplay';
import { CoachSequence } from '@/client/Common/Components/CoachSequence/CoachSequence';
import { DetailsLink } from '@/client/Common/Components/Details/DetailsLink';
import { segmentStyles } from './style';
import { StopList } from '@/client/Routing/Components/RouteList/StopList';
import { Tooltip } from '@mui/material';
import type { FC, HTMLProps, MouseEvent } from 'react';
import type { Route$JourneySegmentTrain } from '@/types/routing';

interface Props extends HTMLProps<HTMLDivElement> {
  segment: Route$JourneySegmentTrain;
  detail?: boolean;
  onTrainClick?: (e: MouseEvent) => void;
}
export const JnySegmentTrain: FC<Props> = ({
  segment,
  onTrainClick,
  detail,
  ...rest
}) => {
  const tooltipTitle =
    segment.train.number &&
    segment.train.line &&
    (segment.train.name.endsWith(segment.train.number)
      ? `Linie ${segment.train.line}`
      : `Nummer ${segment.train.number}`);

  return (
    <div onClick={onTrainClick} {...rest}>
      <div css={segmentStyles.info}>
        <span css={segmentStyles.margin}>
          <span>
            <Tooltip title={tooltipTitle ?? segment.train.name}>
              <span>{segment.train.name}</span>
            </Tooltip>
          </span>
        </span>
        <span css={[segmentStyles.margin, segmentStyles.destination]}>
          {segment.finalDestination}
          <DetailsLink
            train={segment.train}
            evaNumberAlongRoute={segment.segmentStart.evaNumber}
            initialDeparture={segment.departure.scheduledTime}
            jid={segment.jid}
          />
        </span>
        {segment.auslastung && (
          <AuslastungsDisplay auslastung={segment.auslastung} />
        )}
      </div>
      {detail && (
        <>
          {segment.train.number && (
            <CoachSequence
              css={segmentStyles.sequence}
              trainNumber={segment.train.number}
              trainCategory={segment.train.type}
              currentEvaNumber={segment.segmentStart.evaNumber}
              scheduledDeparture={segment.departure.scheduledTime}
              initialDeparture={
                (segment.stops[0].departure || segment.stops[0].arrival)
                  ?.scheduledTime
              }
              administration={segment.train.admin}
              loadHidden={!segment.departure.reihung}
            />
          )}
          <StopList stops={segment.stops} />
        </>
      )}
    </div>
  );
};
