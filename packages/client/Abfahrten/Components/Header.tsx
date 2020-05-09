import { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import AbfahrtenConfigContainer from 'client/Abfahrten/container/AbfahrtenConfigContainer';
import AbfahrtenContainer from 'client/Abfahrten/container/AbfahrtenContainer';
import BaseHeader from 'client/Common/Components/BaseHeader';
import ExtraMenu from './ExtraMenu';
import StationSearch from 'client/Common/Components/StationSearch';
import type { AllowedHafasProfile } from 'types/HAFAS';
import type { Station } from 'types/station';

interface Props {
  /**
   * If set will use HAFAS Search
   */
  profile?: AllowedHafasProfile;
}

const Header = ({ profile }: Props) => {
  const { currentStation } = AbfahrtenContainer.useContainer();
  const {
    config: { searchType },
    urlPrefix,
  } = AbfahrtenConfigContainer.useContainer();
  const history = useHistory();
  const [currentEnteredStation, setCurrentEnteredStation] = useState(
    currentStation
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
    [history, urlPrefix]
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

export default Header;
