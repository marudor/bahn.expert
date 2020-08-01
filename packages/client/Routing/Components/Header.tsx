import { BaseHeader } from 'client/Common/Components/BaseHeader';
import { IconButton } from '@material-ui/core';
import { RoutingConfigContainer } from 'client/Routing/container/RoutingConfigContainer';
import {
  RoutingFav,
  RoutingFavContainer,
  routingFavKey,
  RoutingFavStation,
  useRoutingFavAction,
} from 'client/Routing/container/RoutingFavContainer';
import { singleLineText } from 'client/util/cssUtils';
import { Star, StarBorder } from '@material-ui/icons';
import { useCallback, useMemo } from 'react';
import styled from 'styled-components';
import type { Station } from 'types/station';
function stripStationToRoutingFavStation(station: Station): RoutingFavStation {
  return {
    title: station.title,
    id: station.id,
  };
}

const Wrapper = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr max-content;
  grid-template-rows: 1fr 1fr;
  grid-template-areas: 's f' 'd f';
  align-items: center;
`;
const Start = styled.span`
  grid-area: s;
  ${singleLineText};
`;
const Destination = styled.span`
  grid-area: d;
  ${singleLineText}
`;
const Fav = styled(IconButton)`
  grid-area: f;
`;

const InnerHeader = () => {
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
    <Wrapper>
      <Start>{start?.title}</Start>
      <Destination>{destination?.title}</Destination>
      {currentFav && (
        <Fav data-testid="routingFavButton" onClick={toggleFav}>
          {isFaved ? <Star /> : <StarBorder />}
        </Fav>
      )}
    </Wrapper>
  );
};

export const Header = () => {
  return (
    <BaseHeader>
      <InnerHeader />
    </BaseHeader>
  );
};
