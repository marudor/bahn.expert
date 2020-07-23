import { format } from 'date-fns';
import { useEffect } from 'react';
import HeaderTagContainer from 'client/Common/container/HeaderTagContainer';
import RouteList from './RouteList';
import RoutingConfigContainer from 'client/Routing/container/RoutingConfigContainer';
import Search from './Search';
import styled from 'styled-components/macro';

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

const Main = styled.main`
  margin-left: 0.5em;
  margin-right: 0.5em;
`;

const Routing = () => {
  return (
    <Main>
      <RouteHeaderTags />
      <Search />
      <RouteList />
    </Main>
  );
};

export default Routing;
