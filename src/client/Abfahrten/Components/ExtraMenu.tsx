import {
  Favorite,
  FavoriteBorder,
  FilterList,
  Layers,
  LayersClear,
  Settings,
  Tune,
} from '@mui/icons-material';
import { FilterModal } from './FilterModal';
import { IconButton, Menu, MenuItem } from '@mui/material';
import { useAbfahrtenFilterOpen } from '@/client/Abfahrten/provider/AbfahrtenConfigProvider';
import { useCallback, useState } from 'react';
import { useCurrentAbfahrtenStopPlace } from '@/client/Abfahrten/provider/AbfahrtenProvider';
import {
  useFavActions,
  useFavs,
} from '@/client/Abfahrten/provider/FavProvider';
import { useLageplan } from '@/client/Abfahrten/hooks/useLageplan';
import { useSetCommonConfigOpen } from '@/client/Common/provider/CommonConfigProvider';
import type { FC, SyntheticEvent } from 'react';

export const ExtraMenu: FC = () => {
  const setFilterOpen = useAbfahrtenFilterOpen();
  const setConfigOpen = useSetCommonConfigOpen();
  const currentStopPlace = useCurrentAbfahrtenStopPlace();
  const lageplan = useLageplan(
    currentStopPlace?.name,
    currentStopPlace?.evaNumber,
  );
  const favs = useFavs();
  const { fav, unfav } = useFavActions();
  const isFaved = Boolean(currentStopPlace && favs[currentStopPlace.evaNumber]);
  const [anchor, setAnchor] = useState<undefined | HTMLElement>();
  const toggleFav = useCallback(() => {
    setAnchor(undefined);
    if (currentStopPlace) {
      if (isFaved) {
        unfav(currentStopPlace);
      } else {
        fav(currentStopPlace);
      }
    }
  }, [currentStopPlace, fav, isFaved, unfav]);
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
        {currentStopPlace && [
          <MenuItem data-testid="toggleFav" key="1" onClick={toggleFav}>
            {isFaved ? (
              <>
                <Favorite /> Unfav
              </>
            ) : (
              <>
                <FavoriteBorder /> Fav
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
          <Settings /> Einstellungen
        </MenuItem>
      </Menu>
    </>
  );
};
