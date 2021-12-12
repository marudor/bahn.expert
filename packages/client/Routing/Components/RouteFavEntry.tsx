import { Delete } from '@mui/icons-material';
import { getRouteLink } from 'client/Routing/util';
import { Link } from 'react-router-dom';
import { Paper } from '@mui/material';
import {
  routingFavKey,
  useRoutingFavActions,
} from 'client/Routing/provider/RoutingFavProvider';
import { useCallback } from 'react';
import styled from '@emotion/styled';
import type { FC, SyntheticEvent } from 'react';
import type { RoutingFav } from 'client/Routing/provider/RoutingFavProvider';

const RemoveIcon = styled(Delete)`
  grid-area: r;
`;

const StartName = styled.span`
  grid-area: s;
`;

const DestinationName = styled.span`
  grid-area: d;
`;

const Arrow = styled.span`
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
    backgroundColor: theme.palette.action.hover,
  },
}));

interface Props {
  fav: RoutingFav;
}
export const RouteFavEntry: FC<Props> = ({ fav }) => {
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
      to={getRouteLink(fav.start, fav.destination, fav.via)}
    >
      <ContainerPaper data-testid={`RouteFavEntry-${routingFavKey(fav)}`}>
        <StartName>{fav.start.name}</StartName>
        <DestinationName>{fav.destination.name}</DestinationName>
        <Arrow>{'->'}</Arrow>
        <RemoveIcon data-testid="deleteFav" onClick={removeFav} />
      </ContainerPaper>
    </Link>
  );
};
