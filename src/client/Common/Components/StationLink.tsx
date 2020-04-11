import { Link } from 'react-router-dom';
import { StationSearchType } from 'types/station';
import React from 'react';
import stopPropagation from 'Common/stopPropagation';

interface Props {
  stationName: string;
  searchType?: StationSearchType;
  className?: string;
  urlPrefix?: string;
}

const StationLink = ({
  stationName,
  searchType = StationSearchType.stationsData,
  className,
  urlPrefix = '/',
  ...rest
}: Props) => {
  return (
    <Link
      data-testid="stationLink"
      {...rest}
      className={className}
      onClick={stopPropagation}
      to={{
        pathname: `${urlPrefix}${encodeURIComponent(stationName)}`,
        state: { searchType },
      }}
      title={`Zugabfahrten für ${stationName}`}
    >
      {stationName}
    </Link>
  );
};

export default StationLink;
