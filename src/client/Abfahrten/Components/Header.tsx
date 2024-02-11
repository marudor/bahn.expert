import { BaseHeader } from '@/client/Common/Components/BaseHeader';
import { ExtraMenu } from './ExtraMenu';
import { IconButton } from '@mui/material';
import { Refresh } from '@mui/icons-material';
import { StopPlaceSearch } from '@/client/Common/Components/StopPlaceSearch';
import { useAbfahrtenUrlPrefix } from '@/client/Abfahrten/provider/AbfahrtenConfigProvider';
import { useCallback, useEffect, useState } from 'react';
import { useCurrentAbfahrtenStopPlace } from '@/client/Abfahrten/provider/AbfahrtenProvider';
import { useNavigate } from 'react-router';
import { useQuery } from '@/client/Common/hooks/useQuery';
import { useRefreshCurrent } from '@/client/Abfahrten/provider/AbfahrtenProvider/hooks';
import type { FC } from 'react';
import type { MinimalStopPlace } from '@/types/stopPlace';

interface Props {
  regional?: boolean;
}

export const Header: FC<Props> = ({ regional = false }: Props) => {
  const noHeader = useQuery().noHeader;
  const currentStopPlace = useCurrentAbfahrtenStopPlace();
  const refreshCurrentAbfahrten = useRefreshCurrent(true);
  const urlPrefix = useAbfahrtenUrlPrefix();
  const navigate = useNavigate();
  const [currentEnteredStopPlace, setCurrentEnteredStopPlace] = useState<
    MinimalStopPlace | undefined
  >(currentStopPlace);

  useEffect(() => {
    setCurrentEnteredStopPlace(currentStopPlace);
  }, [currentStopPlace]);
  const submit = useCallback(
    (stopPlace: MinimalStopPlace | undefined) => {
      setCurrentEnteredStopPlace(stopPlace);
      if (!stopPlace) {
        return;
      }
      navigate(`${urlPrefix}${encodeURIComponent(stopPlace.name)}`);
    },
    [urlPrefix, navigate],
  );

  if (noHeader) {
    return null;
  }

  return (
    <BaseHeader>
      <StopPlaceSearch
        id="abfahrtenHeaderSearch"
        autoFocus={!currentStopPlace}
        filterForIris={!regional}
        groupedBySales={regional}
        value={currentEnteredStopPlace}
        onChange={submit}
        placeholder={`Bahnhof (z.B. ${
          currentStopPlace ? currentStopPlace.name : 'Kiel Hbf'
        })`}
      />
      {Boolean(currentStopPlace) && (
        <IconButton
          onClick={refreshCurrentAbfahrten}
          aria-label="refresh"
          color="inherit"
          edge="end"
        >
          <Refresh />
        </IconButton>
      )}
      <ExtraMenu />
    </BaseHeader>
  );
};
