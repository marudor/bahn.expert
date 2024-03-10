import { Delete } from '@mui/icons-material';
import { Paper, styled } from '@mui/material';
import {
  routingFavKey,
  useRoutingFavActions,
} from '@/client/Routing/provider/RoutingFavProvider';
import { useCallback } from 'react';
import { useFetchRouting } from '@/client/Routing/provider/useFetchRouting';
import type { FC, SyntheticEvent } from 'react';
import type { RoutingFav } from '@/client/Routing/provider/RoutingFavProvider';

const RemoveIcon = styled(Delete)`
  grid-area: r;
`;

const StartName = styled('span')`
  grid-area: s;
`;

const DestinationName = styled('span')`
  grid-area: d;
`;

const Arrow = styled('span')`
  grid-area: a;
  justify-self: center;
  margin-right: 1em;
`;

const ContainerPaper = styled(Paper)(({ theme }) => ({
  padding: '.3em',
  display: 'grid',
  marginLeft: '1em',
  marginRight: '1em',
  gridTemplateColumns: 'max-content 1fr max-content',
  gridTemplateRows: '1fr 1fr',
  gridTemplateAreas: '". s r" "a d r"',
  alignItems: 'center',
  flex: 1,
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: theme.vars.palette.action.hover,
  },
}));

interface Props {
  fav: RoutingFav;
}

export const RouteFavEntry: FC<Props> = ({ fav }) => {
  const { unfav } = useRoutingFavActions();
  const { fetchRoutesAndNavigate } = useFetchRouting();
  const removeFav = useCallback(
    (e: SyntheticEvent) => {
      e.stopPropagation();
      e.preventDefault();
      unfav(fav);
    },
    [fav, unfav],
  );

  const searchFav = useCallback(
    (e: SyntheticEvent) => {
      e.preventDefault();
      void fetchRoutesAndNavigate(fav.start, fav.destination, fav.via);
    },
    [fav, fetchRoutesAndNavigate],
  );

  return (
    <ContainerPaper
      onClick={searchFav}
      data-testid={`RouteFavEntry-${routingFavKey(fav)}`}
    >
      <StartName>{fav.start.name}</StartName>
      <DestinationName>{fav.destination.name}</DestinationName>
      <Arrow>{'->'}</Arrow>
      <RemoveIcon data-testid="deleteFav" onClick={removeFav} />
    </ContainerPaper>
  );
};
