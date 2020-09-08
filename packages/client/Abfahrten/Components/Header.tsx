import { BaseHeader } from 'client/Common/Components/BaseHeader';
import { ExtraMenu } from './ExtraMenu';
import { StationSearch } from 'client/Common/Components/StationSearch';
import {
  useAbfahrtenConfig,
  useAbfahrtenUrlPrefix,
} from 'client/Abfahrten/provider/AbfahrtenConfigProvider';
import { useCallback, useEffect, useState } from 'react';
import { useCurrentAbfahrtenStation } from 'client/Abfahrten/provider/AbfahrtenProvider';
import { useHistory } from 'react-router';
import type { AllowedHafasProfile } from 'types/HAFAS';
import type { FC } from 'react';
import type { Station } from 'types/station';

interface Props {
  /**
   * If set will use HAFAS Search
   */
  profile?: AllowedHafasProfile;
}

export const Header: FC<Props> = ({ profile }: Props) => {
  const currentStation = useCurrentAbfahrtenStation();
  const { searchType } = useAbfahrtenConfig();
  const urlPrefix = useAbfahrtenUrlPrefix();
  const history = useHistory();
  const [currentEnteredStation, setCurrentEnteredStation] = useState(
    currentStation,
  );

  useEffect(() => {
    setCurrentEnteredStation(currentStation);
  }, [currentStation]);
  const submit = useCallback(
    (station: Station | undefined) => {
      setCurrentEnteredStation(station);
      if (!station) {
        return;
      }
      history.push(`${urlPrefix}${encodeURIComponent(station.title)}`);
    },
    [history, urlPrefix],
  );

  return (
    <>
      <BaseHeader>
        <StationSearch
          id="abfahrtenHeaderSearch"
          profile={profile}
          autoFocus={!currentStation}
          searchType={searchType}
          value={currentEnteredStation}
          onChange={submit}
          placeholder={`Station (z.B. ${
            currentStation ? currentStation.title : 'Kiel Hbf'
          })`}
        />
        <ExtraMenu />
      </BaseHeader>
    </>
  );
};
