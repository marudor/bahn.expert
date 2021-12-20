import { addMinutes, isBefore } from 'date-fns';
import { stopPropagation } from 'client/Common/stopPropagation';
import { Tooltip } from '@mui/material';
import { Train } from '@mui/icons-material';
import type { CommonProductInfo, CommonStopInfo } from 'types/HAFAS';
import type { FC } from 'react';

interface Props {
  departure?: CommonStopInfo;
  arrival?: CommonStopInfo;
  evaNumber: string;
  train: CommonProductInfo;
  className?: string;
}

export const TravelynxLink: FC<Props> = ({
  departure,
  arrival,
  evaNumber,
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
        href={`https://travelynx.de/s/${evaNumber}?train=${train.type} ${train.number}`}
      >
        <Train />
      </a>
    </Tooltip>
  ) : null;
