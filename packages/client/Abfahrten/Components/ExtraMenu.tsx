import { __RouterContext } from 'react-router';
import {
  FilterList,
  Layers,
  LayersClear,
  Settings,
  Star,
  StarBorder,
  Tune,
} from '@material-ui/icons';
import { FilterModal } from './FilterModal';
import { IconButton, Menu, MenuItem } from '@material-ui/core';
import { SyntheticEvent, useCallback, useState } from 'react';
import { useAbfahrtenModalToggle } from 'client/Abfahrten/provider/AbfahrtenConfigProvider';
import { useCurrentAbfahrtenStation } from 'client/Abfahrten/provider/AbfahrtenProvider';
import {
  useFav,
  useFavs,
  useUnfav,
} from 'client/Abfahrten/provider/FavProvider';
import { useLageplan } from 'client/Abfahrten/hooks/useLageplan';

export const ExtraMenu = () => {
  const { setConfigOpen, setFilterOpen } = useAbfahrtenModalToggle();
  const currentStation = useCurrentAbfahrtenStation();
  const lageplan = useLageplan(currentStation?.title, currentStation?.id);
  const favs = useFavs();
  const fav = useFav();
  const unfav = useUnfav();
  const isFaved = Boolean(currentStation && favs[currentStation.id]);
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
    [anchor],
  );
  const openLageplan = useCallback(() => {
    setAnchor(undefined);
    if (lageplan) {
      window.open(lageplan, '_blank');
    }
  }, [lageplan]);
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
        aria-label="Tune"
        onClick={toggleMenu}
        color="inherit"
      >
        <Tune />
      </IconButton>
      <Menu open={Boolean(anchor)} anchorEl={anchor} onClose={toggleMenu}>
        {currentStation && [
          <MenuItem data-testid="toggleFav" key="1" onClick={toggleFav}>
            {isFaved ? (
              <>
                <Star /> Unfav
              </>
            ) : (
              <>
                <StarBorder /> Fav
              </>
            )}
          </MenuItem>,
          <MenuItem data-testid="lageplan" key="2" onClick={openLageplan}>
            {lageplan ? <Layers /> : <LayersClear />} Lageplan
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
