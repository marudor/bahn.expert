import { Station } from 'types/station';
import { useHistory } from 'react-router';
import AbfahrtenConfigContainer from 'Abfahrten/container/AbfahrtenConfigContainer';
import AbfahrtenContainer from 'Abfahrten/container/AbfahrtenContainer';
import BaseHeader from 'Common/Components/BaseHeader';
import ExtraMenu from './ExtraMenu';
import MetaTags from './MetaTags';
import React, { useCallback, useEffect, useState } from 'react';
import StationSearch from 'Common/Components/StationSearch';

const Header = () => {
  const { currentStation } = AbfahrtenContainer.useContainer();
  const searchType = AbfahrtenConfigContainer.useContainer().config.searchType;
  const history = useHistory();
  const [currentEnteredStation, setCurrentEnteredStation] = useState(
    currentStation
  );

  useEffect(() => {
    setCurrentEnteredStation(currentStation);
  }, [currentStation]);
  const submit = useCallback(
    (station: Station) => {
      setCurrentEnteredStation(station);
      if (!station) {
        return;
      }
      history.push(`/${encodeURIComponent(station.title)}`);
    },
    [history]
  );

  return (
    <>
      <MetaTags currentStation={currentStation} baseUrl={global.baseUrl} />
      <BaseHeader>
        <StationSearch
          id="abfahrtenHeaderSearch"
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
