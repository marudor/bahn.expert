import { Link } from 'react-router-dom';
import { StationSearchType } from 'Common/config';
import React from 'react';
import stopPropagation from 'Common/stopPropagation';

interface Props {
  stationName: string;
  searchType?: StationSearchType;
  className?: string;
}

const StationLink = ({
  stationName,
  searchType = StationSearchType.StationsData,
  className,
  ...rest
}: Props) => {
  return (
    <Link
      data-testid="stationLink"
      {...rest}
      className={className}
      onClick={stopPropagation}
      to={{
        pathname: `/${encodeURIComponent(stationName)}`,
        state: { searchType },
      }}
      title={`Zugabfahrten für ${stationName}`}
    >
      {stationName}
    </Link>
  );
};

export default StationLink;
