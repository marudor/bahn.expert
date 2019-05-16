import { AbfahrtenState } from 'AppState';
import { connect } from 'react-redux';
import { Station } from 'types/station';
import { StationSearchType } from 'Common/config';
import { useRouter } from 'useRouter';
import AppBar from '@material-ui/core/AppBar';
import ExtraMenu from './ExtraMenu';
import HomeMenu from 'Abfahrten/Components/HomeMenu';
import MetaTags from './MetaTags';
import React, { useCallback } from 'react';
import StationSearch from 'Common/Components/StationSearch';
import Toolbar from '@material-ui/core/Toolbar';

type StateProps = {
  currentStation?: Station;
  searchType?: StationSearchType;
  baseUrl: string;
};

type Props = StateProps;

const Header = ({ currentStation, searchType, baseUrl }: Props) => {
  const { history } = useRouter();
  const submit = useCallback(
    (station: Station) => {
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
          <HomeMenu />
          <StationSearch
            autoFocus={!currentStation}
            searchType={searchType}
            value={currentStation}
            onChange={submit}
            placeholder="Station (z.B. Kiel Hbf)"
          />
          <ExtraMenu />
        </Toolbar>
      </AppBar>
    </>
  );
};

export default connect<StateProps, void, void, AbfahrtenState>(state => ({
  currentStation: state.abfahrten.currentStation,
  searchType: state.abfahrtenConfig.config.searchType,
  baseUrl: state.config.baseUrl,
}))(Header);
