import { CommonProductInfo } from 'types/HAFAS';
import { Link } from 'react-router-dom';
import qs from 'qs';
import React from 'react';
import stopPropagation from 'Common/stopPropagation';

interface Props {
  train: CommonProductInfo;
  stationId?: string;
  initialDeparture: number;
}
const DetailsLink = ({ train, stationId, initialDeparture }: Props) => (
  <Link
    onClick={stopPropagation}
    to={`/details/${train.type} ${
      train.number
    }/${initialDeparture}${qs.stringify(
      {
        station: stationId,
      },
      {
        addQueryPrefix: true,
      }
    )}`}
  >
    Details
  </Link>
);

export default DetailsLink;
