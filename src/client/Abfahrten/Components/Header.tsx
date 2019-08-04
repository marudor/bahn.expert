import { shallowEqual } from 'react-redux';
import { Station } from 'types/station';
import { useAbfahrtenSelector } from 'useSelector';
import { useRouter } from 'useRouter';
import ActionHome from '@material-ui/icons/Home';
import AppBar from '@material-ui/core/AppBar';
import ExtraMenu from './ExtraMenu';
import IconButton from '@material-ui/core/IconButton';
import MetaTags from './MetaTags';
import NavigationContext from 'Common/Components/Navigation/NavigationContext';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import StationSearch from 'Common/Components/StationSearch';
import Toolbar from '@material-ui/core/Toolbar';

const Header = () => {
  const { toggleDrawer } = useContext(NavigationContext);
  const { currentStation, searchType, baseUrl } = useAbfahrtenSelector(
    state => ({
      currentStation: state.abfahrten.currentStation,
      searchType: state.abfahrtenConfig.config.searchType,
      baseUrl: state.config.baseUrl,
    }),
    shallowEqual
  );
  const { history } = useRouter();
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
      <MetaTags currentStation={currentStation} baseUrl={baseUrl} />
      <AppBar position="fixed">
        <Toolbar disableGutters>
          <IconButton
            data-testid="home"
            aria-label="Home"
            onClick={toggleDrawer}
            color="inherit"
          >
            <ActionHome color="inherit" />
          </IconButton>
          <StationSearch
            autoFocus={!currentStation}
            searchType={searchType}
            value={currentEnteredStation}
            onChange={submit}
            placeholder={`Station (z.B. ${
              currentStation ? currentStation.title : 'Kiel Hbf'
            })`}
          />
          <ExtraMenu />
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Header;
