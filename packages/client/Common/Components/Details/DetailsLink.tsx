import { Link } from 'react-router-dom';
import { stopPropagation } from 'client/Common/stopPropagation';
import qs from 'qs';
import type { CommonProductInfo } from 'types/HAFAS';
import type { FC } from 'react';

interface Props {
  train: CommonProductInfo;
  stationId?: string;
  initialDeparture: Date;
  urlPrefix?: string;
}
export const DetailsLink: FC<Props> = ({
  train,
  stationId,
  initialDeparture,
  urlPrefix = '/',
}) => (
  <Link
    data-testid="detailsLink"
    onClick={stopPropagation}
    to={`${urlPrefix}details/${train.type} ${
      train.number
    }/${initialDeparture.toISOString()}${qs.stringify(
      {
        station: stationId,
      },
      {
        addQueryPrefix: true,
      },
    )}`}
  >
    Details
  </Link>
);
