import { BaseHeader } from 'client/Common/Components/BaseHeader';
import { IconButton, makeStyles } from '@material-ui/core';
import {
  routingFavKey,
  useRoutingFavActions,
  useRoutingFavs,
} from 'client/Routing/provider/RoutingFavProvider';
import { Star, StarBorder } from '@material-ui/icons';
import { useCallback, useMemo } from 'react';
import { useRoutingConfig } from 'client/Routing/provider/RoutingConfigProvider';
import type { FC } from 'react';
import type { MinimalStopPlace } from 'types/stopPlace';
import type { RoutingFav } from 'client/Routing/provider/RoutingFavProvider';

function stripToMinimalStopPlace(
  stopPlace: MinimalStopPlace,
): MinimalStopPlace {
  return {
    evaNumber: stopPlace.evaNumber,
    name: stopPlace.name,
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
  const { start, destination, via } = useRoutingConfig();
  const favs = useRoutingFavs();
  const { fav, unfav } = useRoutingFavActions();
  const currentFav = useMemo<RoutingFav | undefined>(
    () =>
      start &&
      destination && {
        start: stripToMinimalStopPlace(start),
        destination: stripToMinimalStopPlace(destination),
        via: via.map((v) => stripToMinimalStopPlace(v)),
      },
    [destination, start, via],
  );
  const isFaved = useMemo(
    () => currentFav && routingFavKey(currentFav) in favs,
    [currentFav, favs],
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
      <span className={classes.start}>{start?.name}</span>
      <span className={classes.destination}>{destination?.name}</span>
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

export const Header: FC = () => {
  return (
    <BaseHeader>
      <InnerHeader />
    </BaseHeader>
  );
};
