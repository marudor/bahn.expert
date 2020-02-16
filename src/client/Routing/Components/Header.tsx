import { IconButton } from '@material-ui/core';
import { Station } from 'types/station';
import BaseHeader from 'Common/Components/BaseHeader';
import React, { useCallback, useMemo } from 'react';
import RoutingConfigContainer from 'Routing/container/RoutingConfigContainer';
import RoutingFavContainer, {
  RoutingFav,
  routingFavKey,
  RoutingFavStation,
  useRoutingFavAction,
} from 'Routing/container/RoutingFavContainer';
import ToggleStar from '@material-ui/icons/Star';
import ToggleStarBorder from '@material-ui/icons/StarBorder';
import useStyles from './Header.style';

function stripStationToRoutingFavStation(station: Station): RoutingFavStation {
  return {
    title: station.title,
    id: station.id,
  };
}

const InnerHeader = () => {
  const classes = useStyles();
  const {
    start,
    destination,
    via,
    settings,
  } = RoutingConfigContainer.useContainer();
  const { favs } = RoutingFavContainer.useContainer();
  const { fav, unfav } = useRoutingFavAction();
  const currentFav = useMemo<RoutingFav | undefined>(
    () =>
      start &&
      destination && {
        start: stripStationToRoutingFavStation(start),
        destination: stripStationToRoutingFavStation(destination),
        via: via.map(v => stripStationToRoutingFavStation(v)),
        profile: settings.hafasProfile,
      },
    [destination, settings.hafasProfile, start, via]
  );
  const isFaved = useMemo(
    () => currentFav && routingFavKey(currentFav) in favs,
    [currentFav, favs]
  );
  const toggleFav = useCallback(() => {
    if (currentFav) {
      if (isFaved) {
        unfav(currentFav);
      } else {
        fav(currentFav);
      }
    }
  }, [currentFav, fav, isFaved, unfav]);

  if (!start && !destination) {
    return <span>Routing</span>;
  }

  return (
    <div className={classes.wrap}>
      <span className={classes.start}>{start?.title ?? '?'}</span>
      <span className={classes.arrow}>-></span>
      <span className={classes.destination}>{destination?.title ?? '?'}</span>
      {currentFav && (
        <IconButton
          data-testid="routingFavButton"
          className={classes.fav}
          onClick={toggleFav}
        >
          {isFaved ? <ToggleStar /> : <ToggleStarBorder />}
        </IconButton>
      )}
    </div>
  );
};

const Header = () => {
  return (
    <BaseHeader>
      <InnerHeader />
    </BaseHeader>
  );
};

export default Header;
