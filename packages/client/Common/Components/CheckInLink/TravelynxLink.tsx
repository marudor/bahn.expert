import { isBefore } from 'date-fns';
import { stopPropagation } from 'client/Common/stopPropagation';
import { Tooltip } from '@material-ui/core';
import { Train } from '@material-ui/icons';
import type { CommonProductInfo, CommonStopInfo } from 'types/HAFAS';
import type { Station } from 'types/station';

interface Props {
  departure?: CommonStopInfo;
  arrival?: CommonStopInfo;
  station: Station;
  train: CommonProductInfo;
  className?: string;
}

// 30 Minutes in ms
const timeConstraint = 30 * 60 * 1000;

export const TravelynxLink = ({
  departure,
  arrival,
  station,
  train,
  className,
}: Props) =>
  departure &&
  !departure.cancelled &&
  isBefore(
    arrival ? arrival.scheduledTime : departure.scheduledTime,
    Date.now() + timeConstraint
  ) ? (
    <Tooltip title="travelynx">
      <a
        data-testid="travellynxlink"
        className={className}
        onClick={stopPropagation}
        rel="noopener noreferrer"
        target="_blank"
        href={`https://travelynx.de/s/${station.id}?train=${train.type} ${train.number}`}
      >
        <Train />
      </a>
    </Tooltip>
  ) : null;
