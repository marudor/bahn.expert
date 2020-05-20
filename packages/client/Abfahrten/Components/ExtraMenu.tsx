import { __RouterContext } from 'react-router';
import { IconButton } from '@material-ui/core';
import { SyntheticEvent, useCallback, useState } from 'react';
import AbfahrtenConfigContainer from 'client/Abfahrten/container/AbfahrtenConfigContainer';
import AbfahrtenContainer from 'client/Abfahrten/container/AbfahrtenContainer';
import ActionTune from '@material-ui/icons/Tune';
import FavContainer, {
  useFav,
  useUnfav,
} from 'client/Abfahrten/container/FavContainer';
import FilterList from '@material-ui/icons/FilterList';
import FilterModal from './FilterModal';
import Layers from '@material-ui/icons/Layers';
import LayersClear from '@material-ui/icons/LayersClear';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Settings from '@material-ui/icons/Settings';
import ToggleStar from '@material-ui/icons/Star';
import ToggleStarBorder from '@material-ui/icons/StarBorder';
import useLageplan from 'client/Abfahrten/hooks/useLageplan';

const ExtraMenu = () => {
  const {
    setConfigOpen,
    setFilterOpen,
  } = AbfahrtenConfigContainer.useContainer();
  const { currentStation } = AbfahrtenContainer.useContainer();
  const lageplan = useLageplan(currentStation?.title, currentStation?.id);
  const { favs } = FavContainer.useContainer();
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
    [anchor]
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
        <ActionTune />
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

export default ExtraMenu;
