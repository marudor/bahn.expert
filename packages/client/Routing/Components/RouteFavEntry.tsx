import { AllowedHafasProfile } from 'types/HAFAS';
import { Delete } from '@material-ui/icons';
import { getRouteLink } from 'client/Routing/util';
import { Link } from 'react-router-dom';
import { makeStyles, Paper } from '@material-ui/core';
import {
  routingFavKey,
  useRoutingFavActions,
} from 'client/Routing/provider/RoutingFavProvider';
import { useCallback } from 'react';
import type { FC, SyntheticEvent } from 'react';
import type { RoutingFav } from 'client/Routing/provider/RoutingFavProvider';

const useStyles = makeStyles((theme) => ({
  wrap: {
    padding: '.3em',
    display: 'grid',
    gridTempateColumns: 'max-content 1fr max-content max-content',
    gridTemplateRows: '1fr 1fr',
    gridTemplateAreas: '". s f r" "a d f r"',
    alignItems: 'center',
    flex: 1,
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
  start: {
    gridArea: 's',
  },
  destination: {
    gridArea: 'd',
  },
  arrow: {
    gridArea: 'a',
    justifySelf: 'center',
    marginRight: '1em',
  },
  profile: {
    gridArea: 'f',
  },
  delete: {
    gridArea: 'r',
  },
}));

interface Props {
  fav: RoutingFav;
}
export const RouteFavEntry: FC<Props> = ({ fav }) => {
  const classes = useStyles();
  const { unfav } = useRoutingFavActions();
  const removeFav = useCallback(
    (e: SyntheticEvent) => {
      e.stopPropagation();
      e.preventDefault();
      unfav(fav);
    },
    [fav, unfav],
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
        className={classes.wrap}
        data-testid={`RouteFavEntry-${routingFavKey(fav)}`}
      >
        <span className={classes.start}>{fav.start.name}</span>
        <span className={classes.destination}>{fav.destination.name}</span>
        <span className={classes.arrow}>{'->'}</span>
        <span className={classes.profile}>
          {Object.keys(AllowedHafasProfile).find(
            // @ts-expect-error works
            (key) => AllowedHafasProfile[key] === fav.profile,
          )}
        </span>
        <Delete
          data-testid="deleteFav"
          className={classes.delete}
          onClick={removeFav}
        />
      </Paper>
    </Link>
  );
};
