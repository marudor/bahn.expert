import { AuslastungsDisplay } from 'client/Common/Components/AuslastungsDisplay';
import { DetailsLink } from 'client/Common/Components/Details/DetailsLink';
import { Reihung } from 'client/Common/Components/Reihung';
import { segmentStyles } from './style';
import { StopList } from 'client/Routing/Components/RouteList/StopList';
import { Tooltip } from '@mui/material';
import type { FC, HTMLProps, MouseEvent } from 'react';
import type { Route$JourneySegmentTrain } from 'types/routing';

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
            evaNumberAlongRoute={segment.segmentStart.id}
            initialDeparture={segment.departure.scheduledTime}
          />
        </span>
        {segment.auslastung && (
          <AuslastungsDisplay auslastung={segment.auslastung} />
        )}
      </div>
      {detail && (
        <>
          {segment.train.number && (
            <Reihung
              css={segmentStyles.reihung}
              trainNumber={segment.train.number}
              currentEvaNumber={segment.segmentStart.id}
              scheduledDeparture={segment.departure.scheduledTime}
              loadHidden={!segment.departure.reihung}
            />
          )}
          <StopList stops={segment.stops} />
        </>
      )}
    </div>
  );
};
