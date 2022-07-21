import { Link } from 'react-router-dom';
import { stopPropagation } from 'client/Common/stopPropagation';
import qs from 'qs';
import type { CommonProductInfo } from 'types/HAFAS';
import type { FC } from 'react';

interface Props {
  train: Pick<CommonProductInfo, 'type' | 'number'>;
  evaNumber?: string;
  initialDeparture: Date;
  urlPrefix?: string;
}
export const DetailsLink: FC<Props> = ({
  train,
  evaNumber,
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
        stopEva: evaNumber,
      },
      {
        addQueryPrefix: true,
      },
    )}`}
  >
    Details
  </Link>
);
