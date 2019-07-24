import { __RouterContext } from 'react-router';
import { AbfahrtenState } from 'AppState';
import { connect, ResolveThunks } from 'react-redux';
import { fav, unfav } from 'Abfahrten/actions/fav';
import { getLageplan, openFilter } from 'Abfahrten/actions/abfahrten';
import { IconButton } from '@material-ui/core';
import { openSettings } from 'Abfahrten/actions/abfahrtenConfig';
import { openTheme } from 'Common/actions/config';
import { Station } from 'types/station';
import { useRouter } from 'useRouter';
import ActionMenu from '@material-ui/icons/Menu';
import FilterList from '@material-ui/icons/FilterList';
import FilterModal from './FilterModal';
import HelpOutline from '@material-ui/icons/HelpOutline';
import InvertColors from '@material-ui/icons/InvertColors';
import Layers from '@material-ui/icons/Layers';
import LayersClear from '@material-ui/icons/LayersClear';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import React, { SyntheticEvent, useCallback, useState } from 'react';
import Settings from '@material-ui/icons/Settings';
import ThemeModal from 'Common/Components/ThemeModal';
import ToggleStar from '@material-ui/icons/Star';
import ToggleStarBorder from '@material-ui/icons/StarBorder';
import Zugsuche from 'Common/Components/Zugsuche';

type StateProps = {
  isFaved: boolean;
  currentStation?: Station;
  lageplan?: null | string;
};

type DispatchProps = ResolveThunks<{
  fav: typeof fav;
  unfav: typeof unfav;
  openSettings: typeof openSettings;
  openFilter: typeof openFilter;
  getLageplan: typeof getLageplan;
  openTheme: typeof openTheme;
}>;

type ReduxProps = StateProps & DispatchProps;

type Props = ReduxProps;

const ExtraMenu = ({
  isFaved,
  currentStation,
  lageplan,
  unfav,
  fav,
  getLageplan,
  openSettings,
  openFilter,
  openTheme,
}: Props) => {
  const { history } = useRouter();
  const [anchor, setAnchor] = useState<undefined | HTMLElement>();
  const toggleFav = useCallback(() => {
    setAnchor(undefined);
    if (currentStation) {
      if (isFaved) {
        unfav(currentStation);
      } else {
        fav(currentStation);
      }
    }
  }, [currentStation, fav, isFaved, unfav]);
  const toggleMenu = useCallback(
    (e: SyntheticEvent<HTMLElement>) => {
      setAnchor(anchor ? undefined : e.currentTarget);
    },
    [anchor]
  );
  const openLageplan = useCallback(async () => {
    setAnchor(undefined);
    if (lageplan === undefined && currentStation) {
      const fetchedLageplan = await getLageplan(currentStation.title);

      if (fetchedLageplan) {
        window.open(fetchedLageplan, '_blank');
      }
    } else if (lageplan) {
      window.open(lageplan, '_blank');
    }
  }, [currentStation, getLageplan, lageplan]);
  const openFilterCb = useCallback(() => {
    openFilter();
    setAnchor(undefined);
  }, [openFilter]);
  const openSettingsCb = useCallback(() => {
    openSettings();
    setAnchor(undefined);
  }, [openSettings]);
  const toAbout = useCallback(() => {
    history.push('/about');
    setAnchor(undefined);
  }, [history]);

  return (
    <>
      <FilterModal />
      <ThemeModal />
      <IconButton
        data-testid="menu"
        aria-label="Menu"
        onClick={toggleMenu}
        color="inherit"
      >
        <ActionMenu />
      </IconButton>
      <Menu open={Boolean(anchor)} anchorEl={anchor} onClose={toggleMenu}>
        {currentStation && [
          <MenuItem data-testid="toggleFav" key="1" onClick={toggleFav}>
            {isFaved ? (
              <>
                <ToggleStar /> Unfav
              </>
            ) : (
              <>
                <ToggleStarBorder /> Fav
              </>
            )}
          </MenuItem>,
          <MenuItem data-testid="lageplan" key="2" onClick={openLageplan}>
            {lageplan !== null ? <Layers /> : <LayersClear />} Lageplan
          </MenuItem>,
        ]}
        <MenuItem data-testid="openFilter" onClick={openFilterCb}>
          <FilterList /> Filter
        </MenuItem>
        <Zugsuche onClose={toggleMenu} />
        <MenuItem
          data-testid="themeMenu"
          aria-label="ThemeMenu"
          onClick={openTheme}
        >
          <InvertColors /> Theme
        </MenuItem>
        <MenuItem data-testid="openSettings" onClick={openSettingsCb}>
          <Settings /> Settings
        </MenuItem>
        <MenuItem data-testid="toAbout" onClick={toAbout}>
          <HelpOutline />
          About
        </MenuItem>
      </Menu>
    </>
  );
};

export default connect<StateProps, DispatchProps, {}, AbfahrtenState>(
  state => ({
    isFaved: Boolean(
      state.abfahrten.currentStation &&
        state.fav.favs[state.abfahrten.currentStation.id]
    ),
    currentStation: state.abfahrten.currentStation,
    lageplan: state.abfahrten.lageplan,
  }),
  {
    fav,
    unfav,
    openSettings,
    getLageplan,
    openFilter,
    openTheme,
  }
)(ExtraMenu);
