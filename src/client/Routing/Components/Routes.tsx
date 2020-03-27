import { format } from 'date-fns';
import HeaderTagContainer from 'Common/container/HeaderTagContainer';
import React, { useEffect } from 'react';
import RouteList from './RouteList';
import RoutingConfigContainer from 'Routing/container/RoutingConfigContainer';
import Search from './Search';

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

const Routing = () => {
  return (
    <main style={{ marginLeft: '.5em', marginRight: '.5em' }}>
      <RouteHeaderTags />
      <Search />
      <RouteList />
    </main>
  );
};

export default Routing;
