import { Link } from 'react-router-dom';
import { StationNameWithRL100 } from '@/client/Common/Components/StationNameWithRl100';
import { stopPropagation } from '@/client/Common/stopPropagation';
import type { FC } from 'react';

interface Props {
  stationName: string;
  evaNumber?: string;
  className?: string;
  urlPrefix?: string;
}

export const StationLink: FC<Props> = ({
  stationName,
  className,
  urlPrefix = '/',
  evaNumber,
  ...rest
}) => {
  return (
    <Link
      data-testid="stationLink"
      className={className}
      onClick={stopPropagation}
      to={`${urlPrefix}${encodeURIComponent(stationName)}`}
      title={`Zugabfahrten für ${stationName}`}
      {...rest}
    >
      {evaNumber ? (
        <StationNameWithRL100
          station={{
            title: stationName,
            id: evaNumber,
          }}
        />
      ) : (
        stationName
      )}
    </Link>
  );
};
