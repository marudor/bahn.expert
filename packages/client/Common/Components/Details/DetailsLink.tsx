import { Link } from 'react-router-dom';
import { stopPropagation } from 'client/Common/stopPropagation';
import qs from 'qs';
import type { CommonProductInfo } from 'types/HAFAS';

interface Props {
  train: CommonProductInfo;
  stationId?: string;
  initialDeparture: number;
  urlPrefix?: string;
}
export const DetailsLink = ({
  train,
  stationId,
  initialDeparture,
  urlPrefix = '/',
}: Props) => (
  <Link
    data-testid="detailsLink"
    onClick={stopPropagation}
    to={`${urlPrefix}details/${train.type} ${
      train.number
    }/${initialDeparture}${qs.stringify(
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
