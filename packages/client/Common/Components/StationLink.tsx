import { Link } from 'react-router-dom';
import { StationSearchType } from 'types/station';
import { stopPropagation } from 'client/Common/stopPropagation';
import type { FC } from 'react';

interface Props {
  stationName: string;
  searchType?: StationSearchType;
  className?: string;
  urlPrefix?: string;
}

export const StationLink: FC<Props> = ({
  stationName,
  searchType = StationSearchType.stationsData,
  className,
  urlPrefix = '/',
  ...rest
}) => {
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
