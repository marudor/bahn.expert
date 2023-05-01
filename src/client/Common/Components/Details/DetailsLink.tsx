import { Link } from 'react-router-dom';
import { stopPropagation } from '@/client/Common/stopPropagation';
import qs from 'qs';
import type { CommonProductInfo } from '@/types/HAFAS';
import type { FC } from 'react';

interface Props {
  train: Pick<CommonProductInfo, 'type' | 'number'>;
  evaNumberAlongRoute?: string;
  initialDeparture: Date;
  journeyId?: string;
  urlPrefix?: string;
  jid?: string;
}
export const DetailsLink: FC<Props> = ({
  train,
  evaNumberAlongRoute,
  initialDeparture,
  journeyId,
  jid,
  urlPrefix = '/',
}) => {
  if (!train.number || !train.type) {
    return null;
  }
  return (
    <Link
      data-testid="detailsLink"
      onClick={stopPropagation}
      to={`${urlPrefix}details/${train.type} ${
        train.number
      }/${initialDeparture.toISOString()}${qs.stringify(
        {
          evaNumberAlongRoute,
          journeyId,
          jid,
        },
        {
          addQueryPrefix: true,
        },
      )}`}
    >
      Details
    </Link>
  );
};
