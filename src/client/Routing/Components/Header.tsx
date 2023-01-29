import { BaseHeader } from '@/client/Common/Components/BaseHeader';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import {
  routingFavKey,
  useRoutingFavActions,
  useRoutingFavs,
} from '@/client/Routing/provider/RoutingFavProvider';
import { useCallback, useMemo } from 'react';
import { useRoutingConfig } from '@/client/Routing/provider/RoutingConfigProvider';
import styled from '@emotion/styled';
import type { FC } from 'react';
import type { MinimalStopPlace } from '@/types/stopPlace';
import type { RoutingFav } from '@/client/Routing/provider/RoutingFavProvider';

function stripToMinimalStopPlace(stopPlace: MinimalStopPlace): MinimalStopPlace;
function stripToMinimalStopPlace(
  stopPlace?: MinimalStopPlace,
): MinimalStopPlace | undefined;
function stripToMinimalStopPlace(
  stopPlace?: MinimalStopPlace,
): MinimalStopPlace | undefined {
  if (!stopPlace) return undefined;
  return {
    evaNumber: stopPlace.evaNumber,
    name: stopPlace.name,
  };
}

const Container = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr max-content;
  grid-template-rows: 1fr 1fr;
  grid-template-areas: 's f' 'd f';
  align-items: center;
`;

const StartName = styled.span(({ theme }) => theme.mixins.singleLineText, {
  gridArea: 's',
});

const DestinationName = styled.span(
  ({ theme }) => theme.mixins.singleLineText,
  {
    gridArea: 'd',
  },
);

const FavoriteButton = styled(IconButton)`
  grid-area: f;
`;

const InnerHeader = () => {
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
    <Container>
      <StartName>{start?.name}</StartName>
      <DestinationName>{destination?.name}</DestinationName>
      {currentFav && (
        <FavoriteButton data-testid="routingFavButton" onClick={toggleFav}>
          {isFaved ? <Favorite /> : <FavoriteBorder />}
        </FavoriteButton>
      )}
    </Container>
  );
};

export const Header: FC = () => {
  return (
    <BaseHeader>
      <InnerHeader />
    </BaseHeader>
  );
};
