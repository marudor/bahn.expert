import { CommonProductInfo } from 'types/HAFAS';
import { Link } from 'react-router-dom';
import qs from 'qs';
import React from 'react';
import stopPropagation from 'Common/stopPropagation';

interface Props {
  train: CommonProductInfo;
  initialDeparture: number;
}
const DetailsLink = ({ train, initialDeparture }: Props) => (
  <Link
    onClick={stopPropagation}
    to={`/details/${train.type} ${
      train.number
    }/${initialDeparture}${qs.stringify(
      {
        line: train.line,
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
