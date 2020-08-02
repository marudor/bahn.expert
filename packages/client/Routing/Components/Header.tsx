import { BaseHeader } from 'client/Common/Components/BaseHeader';
import { IconButton, makeStyles } from '@material-ui/core';
import { RoutingConfigContainer } from 'client/Routing/container/RoutingConfigContainer';
import {
  RoutingFav,
  RoutingFavContainer,
  routingFavKey,
  RoutingFavStation,
  useRoutingFavAction,
} from 'client/Routing/container/RoutingFavContainer';
import { Star, StarBorder } from '@material-ui/icons';
import { useCallback, useMemo } from 'react';
import type { Station } from 'types/station';

function stripStationToRoutingFavStation(station: Station): RoutingFavStation {
  return {
    title: station.title,
    id: station.id,
  };
}

const useStyles = makeStyles((theme) => ({
  wrap: {
    width: '100%',
    display: 'grid',
    gridTemplateColumns: '1fr max-content',
    gridTemplateRows: '1fr 1fr',
    gridTemplateAreas: '"s f" "d f"',
    alignItems: 'center',
  },
  start: {
    gridArea: 's',
    ...theme.mixins.singleLineText,
  },
  destination: {
    gridArea: 'd',
    ...theme.mixins.singleLineText,
  },
  fav: {
    gridArea: 'f',
  },
}));

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
        via: via.map((v) => stripStationToRoutingFavStation(v)),
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
      <span className={classes.start}>{start?.title}</span>
      <span className={classes.destination}>{destination?.title}</span>
      {currentFav && (
        <IconButton
          className={classes.fav}
          data-testid="routingFavButton"
          onClick={toggleFav}
        >
          {isFaved ? <Star /> : <StarBorder />}
        </IconButton>
      )}
    </div>
  );
};

export const Header = () => {
  return (
    <BaseHeader>
      <InnerHeader />
    </BaseHeader>
  );
};
