import { __RouterContext } from 'react-router';
import { getLageplan } from 'Abfahrten/actions/abfahrten';
import { IconButton } from '@material-ui/core';
import { shallowEqual, useDispatch } from 'react-redux';
import { useAbfahrtenSelector } from 'useSelector';
import AbfahrtenConfigContainer from 'Abfahrten/container/AbfahrtenConfigContainer';
import ActionMenu from '@material-ui/icons/Menu';
import FavContainer, {
  useFav,
  useUnfav,
} from 'Abfahrten/container/FavContainer';
import FilterList from '@material-ui/icons/FilterList';
import FilterModal from './FilterModal';
import Layers from '@material-ui/icons/Layers';
import LayersClear from '@material-ui/icons/LayersClear';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import React, { SyntheticEvent, useCallback, useState } from 'react';
import Settings from '@material-ui/icons/Settings';
import ToggleStar from '@material-ui/icons/Star';
import ToggleStarBorder from '@material-ui/icons/StarBorder';

const ExtraMenu = () => {
  const {
    setConfigOpen,
    setFilterOpen,
  } = AbfahrtenConfigContainer.useContainer();
  const { currentStation, lageplan } = useAbfahrtenSelector(
    state => ({
      currentStation: state.abfahrten.currentStation,
      lageplan: state.abfahrten.lageplan,
    }),
    shallowEqual
  );
  const { favs } = FavContainer.useContainer();
  const fav = useFav();
  const unfav = useUnfav();
  const isFaved = Boolean(currentStation && favs[currentStation.id]);
  const dispatch = useDispatch();
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
      const fetchedLageplan: any = await dispatch(
        getLageplan(currentStation.title)
      );

      if (fetchedLageplan) {
        window.open(fetchedLageplan, '_blank');
      }
    } else if (lageplan) {
      window.open(lageplan, '_blank');
    }
  }, [currentStation, dispatch, lageplan]);
  const openFilterCb = useCallback(() => {
    setFilterOpen(true);
    setAnchor(undefined);
  }, [setFilterOpen]);
  const openSettingsCb = useCallback(() => {
    setConfigOpen(true);
    setAnchor(undefined);
  }, [setConfigOpen]);

  return (
    <>
      <FilterModal />
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
        <MenuItem data-testid="openSettings" onClick={openSettingsCb}>
          <Settings /> Settings
        </MenuItem>
      </Menu>
    </>
  );
};

export default ExtraMenu;
