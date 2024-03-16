import { formatDuration } from '@/client/Routing/util';
import { Paper, styled } from '@mui/material';
import { RouteSegments } from './RouteSegments';
import { Time } from '@/client/Common/Components/Time';
import { useMemo } from 'react';
import type { FC, SyntheticEvent } from 'react';
import type { SingleRoute } from '@/types/routing';

interface Props {
  route: SingleRoute;
  detail: boolean;
  onClick: (e: SyntheticEvent) => void;
}

const Container = styled(Paper)`
  grid-template-columns: 2fr 2fr 2fr 2fr;
  grid-template-rows: 60px 20px;
  display: grid;
  margin-bottom: 0.2em;
  align-items: center;
  min-height: 3em;
`;

const StyledTime = styled(Time)`
  & > span {
    margin-right: 0.2em;
  }
`;

const StyledRouteSegments = styled(RouteSegments)`
  text-decoration: initial;
  overflow: hidden;
  grid-area: 3 / 1 / 4 / 5;
`;

const Product = styled('span')`
  font-size: 0.9em;
  grid-area: 2 / 1 / 3 / 5;
`;

export const Route: FC<Props> = ({ route, detail, onClick }) => {
  const segmentTypes = useMemo(() => {
    if (route.segmentTypes.length > 1) return route.segmentTypes.join(' - ');

    const firstSegment = route.segments[0];

    if (!firstSegment) return null;

    return <span>{firstSegment.train.name}</span>;
  }, [route]);

  return (
    <Container data-testid={`Route-${route.cid}`} onClick={onClick} square>
      <StyledTime
        multiLine
        real={route.departure.time}
        delay={route.departure.delay}
      />
      <StyledTime
        multiLine
        real={route.arrival.time}
        delay={route.arrival.delay}
      />
      <span>{formatDuration(route.duration)}</span>
      <span>{route.changes}</span>
      {detail ? (
        <StyledRouteSegments segments={route.segments} />
      ) : (
        <Product>{segmentTypes}</Product>
      )}
    </Container>
  );
};
