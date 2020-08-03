import { format } from 'date-fns';
import { HeaderTagContainer } from 'client/Common/container/HeaderTagContainer';
import { makeStyles } from '@material-ui/core';
import { RouteList } from './RouteList';
import { RoutingConfigContainer } from 'client/Routing/container/RoutingConfigContainer';
import { Search } from './Search';
import { useEffect } from 'react';

const RouteHeaderTags = () => {
  const {
    resetTitleAndDescription,
    updateTitle,
    updateDescription,
  } = HeaderTagContainer.useContainer();
  const {
    start,
    destination,
    via,
    date,
  } = RoutingConfigContainer.useContainer();

  useEffect(() => {
    if (!start && !destination) {
      resetTitleAndDescription();
    } else {
      updateTitle(
        `${start?.title ?? '?'} -> ${destination?.title ?? '?'} @ ${format(
          date || Date.now(),
          'HH:mm dd.MM.yy'
        )}`
      );
      const viaString = `-> ${via.map((v) => `${v.title} -> `)}`;

      updateDescription(
        `${start?.title ?? '?'} ${viaString}${
          destination?.title ?? '?'
        } @ ${format(date || Date.now(), 'HH:mm dd.MM.yy')}`
      );
    }
  });

  return null;
};

const useStyles = makeStyles({
  wrap: {
    marginLeft: '.5em',
    marginRight: '.5em',
  },
});

export const Routes = () => {
  const classes = useStyles();
  return (
    <main className={classes.wrap}>
      <RouteHeaderTags />
      <Search />
      <RouteList />
    </main>
  );
};
