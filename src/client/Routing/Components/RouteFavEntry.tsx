import { AllowedHafasProfile } from 'types/HAFAS';
import { getRouteLink } from 'Routing/util';
import { Link } from 'react-router-dom';
import { Paper } from '@material-ui/core';
import { RoutingFav } from 'Routing/container/RoutingFavContainer';
import React from 'react';
import useStyles from './RouteFavEntry.style';

interface Props {
  fav: RoutingFav;
}

const RouteFavEntry = ({ fav }: Props) => {
  const classes = useStyles();

  return (
    <Link
      to={{
        pathname: getRouteLink(fav.start, fav.destination, fav.via),
        state: {
          fav,
        },
      }}
    >
      <Paper className={classes.wrap}>
        <span className={classes.start}>{fav.start.title}</span>
        <span className={classes.destination}>{fav.destination.title}</span>
        <span className={classes.arrow}>-></span>
        <span className={classes.profile}>
          {Object.keys(AllowedHafasProfile).find(
            // @ts-ignore
            key => AllowedHafasProfile[key] === fav.profile
          )}
        </span>
      </Paper>
    </Link>
  );
};

export default React.memo(RouteFavEntry);
