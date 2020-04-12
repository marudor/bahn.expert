import { AllowedHafasProfile } from 'types/HAFAS';
import { getRouteLink } from 'Routing/util';
import { Link } from 'react-router-dom';
import { Paper } from '@material-ui/core';
import {
  RoutingFav,
  routingFavKey,
  useRoutingFavAction,
} from 'Routing/container/RoutingFavContainer';
import ActionDelete from '@material-ui/icons/Delete';
import React, { SyntheticEvent, useCallback } from 'react';
import useStyles from './RouteFavEntry.style';

interface Props {
  fav: RoutingFav;
}

const RouteFavEntry = ({ fav }: Props) => {
  const classes = useStyles();
  const { unfav } = useRoutingFavAction();
  const removeFav = useCallback(
    (e: SyntheticEvent) => {
      e.stopPropagation();
      e.preventDefault();
      unfav(fav);
    },
    [fav, unfav]
  );

  return (
    <Link
      date-testid="RouteFavEntry"
      to={{
        pathname: getRouteLink(fav.start, fav.destination, fav.via),
        state: {
          fav,
        },
      }}
    >
      <Paper
        data-testid={`RouteFavEntry-${routingFavKey(fav)}`}
        className={classes.wrap}
      >
        <span className={classes.start}>{fav.start.title}</span>
        <span className={classes.destination}>{fav.destination.title}</span>
        <span className={classes.arrow}>{'->'}</span>
        <span className={classes.profile}>
          {Object.keys(AllowedHafasProfile).find(
            // @ts-expect-error
            (key) => AllowedHafasProfile[key] === fav.profile
          )}
        </span>
        <ActionDelete className={classes.delete} onClick={removeFav} />
      </Paper>
    </Link>
  );
};

export default React.memo(RouteFavEntry);
