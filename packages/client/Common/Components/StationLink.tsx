import { Link } from 'react-router-dom';
import { stopPropagation } from 'client/Common/stopPropagation';
import type { FC } from 'react';

interface Props {
  stationName: string;
  className?: string;
  urlPrefix?: string;
}

export const StationLink: FC<Props> = ({
  stationName,
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
      to={`${urlPrefix}${encodeURIComponent(stationName)}`}
      title={`Zugabfahrten für ${stationName}`}
    >
      {stationName}
    </Link>
  );
};
