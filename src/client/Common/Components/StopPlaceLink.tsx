import { Link } from 'react-router-dom';
import { StopPlaceNameWithRl100 } from '@/client/Common/Components/StopPlaceNameWithRl100';
import { stopPropagation } from '@/client/Common/stopPropagation';
import type { FC } from 'react';
import type { MinimalStopPlace } from '@/types/stopPlace';

interface Props {
  stopPlace: {
    name: string;
  } & Partial<Pick<MinimalStopPlace, 'evaNumber' | 'ril100'>>;
  className?: string;
  urlPrefix?: string;
}

export const StopPlaceLink: FC<Props> = ({
  className,
  urlPrefix = '/',
  stopPlace,
  ...rest
}) => {
  return (
    <Link
      data-testid="stationLink"
      className={className}
      onClick={stopPropagation}
      to={`${urlPrefix}${encodeURIComponent(stopPlace.name)}`}
      title={`Zugabfahrten für ${stopPlace.name}`}
      {...rest}
    >
      {stopPlace.evaNumber ? (
        <StopPlaceNameWithRl100 stopPlace={stopPlace as MinimalStopPlace} />
      ) : (
        stopPlace.name
      )}
    </Link>
  );
};
