import { AllowedHafasProfile } from 'types/HAFAS';
import { getRouteLink } from 'client/Routing/util';
import { Link } from 'react-router-dom';
import { Paper } from '@material-ui/core';
import {
  RoutingFav,
  routingFavKey,
  useRoutingFavAction,
} from 'client/Routing/container/RoutingFavContainer';
import { SyntheticEvent, useCallback } from 'react';
import ActionDelete from '@material-ui/icons/Delete';
import styled from 'styled-components';

interface Props {
  fav: RoutingFav;
}

const Wrapper = styled(Paper)`
  padding: 0.3em;
  display: grid;
  grid-template-columns: max-content 1fr max-content max-content;
  grid-template-rows: 1fr 1fr;
  grid-template-areas: '. s f r' 'a d f r';
  align-items: center;
  flex: 1;
  cursor: pointer;
  &:hover {
    background-color: ${({ theme }) => theme.palette.action.hover};
  }
`;

const Start = styled.span`
  grid-area: s;
`;
const Destination = styled.span`
  grid-area: d;
`;
const Arrow = styled.span`
  grid-area: a;
  justify-self: center;
  margin-right: 1em;
`;
const Profile = styled.span`
  grid-area: f;
`;
const Delete = styled(ActionDelete)`
  grid-area: r;
`;
export const RouteFavEntry = ({ fav }: Props) => {
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
      <Wrapper data-testid={`RouteFavEntry-${routingFavKey(fav)}`}>
        <Start>{fav.start.title}</Start>
        <Destination>{fav.destination.title}</Destination>
        <Arrow>{'->'}</Arrow>
        <Profile>
          {Object.keys(AllowedHafasProfile).find(
            // @ts-ignore
            (key) => AllowedHafasProfile[key] === fav.profile
          )}
        </Profile>
        <Delete onClick={removeFav} />
      </Wrapper>
    </Link>
  );
};
