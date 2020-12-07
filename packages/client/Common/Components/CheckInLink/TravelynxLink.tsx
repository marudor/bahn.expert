import { addMinutes, isBefore } from 'date-fns';
import { stopPropagation } from 'client/Common/stopPropagation';
import { Tooltip } from '@material-ui/core';
import { Train } from '@material-ui/icons';
import type { CommonProductInfo, CommonStopInfo } from 'types/HAFAS';
import type { FC } from 'react';
import type { Station } from 'types/station';

interface Props {
  departure?: CommonStopInfo;
  arrival?: CommonStopInfo;
  station: Station;
  train: CommonProductInfo;
  className?: string;
}

export const TravelynxLink: FC<Props> = ({
  departure,
  arrival,
  station,
  train,
  className,
}) =>
  departure &&
  !departure.cancelled &&
  isBefore(
    arrival ? arrival.scheduledTime : departure.scheduledTime,
    addMinutes(Date.now(), 30),
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
