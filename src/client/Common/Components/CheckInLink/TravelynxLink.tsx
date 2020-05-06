import { isBefore } from 'date-fns';
import { Tooltip } from '@material-ui/core';
import stopPropagation from 'Common/stopPropagation';
import TrainIcon from '@material-ui/icons/Train';
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

const TravelynxLink = ({
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
        <TrainIcon />
      </a>
    </Tooltip>
  ) : null;

export default TravelynxLink;
