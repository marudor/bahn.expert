import { formatDuration } from 'client/Routing/util';
import { Paper } from '@material-ui/core';
import { PlannedType } from 'client/Common/Components/PlannedType';
import { RouteSegments } from './RouteSegments';
import { SyntheticEvent, useMemo } from 'react';
import { Time } from 'client/Common/Components/Time';
import styled, { css } from 'styled-components';
import type { SingleRoute } from 'types/routing';

interface Props {
  route: SingleRoute;
  detail: boolean;
  onClick: (e: SyntheticEvent) => void;
}

export const gridStyle = css`
  grid-template-columns: 2fr 2fr 2fr 1fr;
  grid-template-rows: 60px 20px;
  display: grid;
  margin-bottom: 0.2em;
  align-items: center;
`;
const PaperWrap = styled(Paper)`
  min-height: 3em;
  ${gridStyle};
`;
const StyledTime = styled(Time)`
  > span {
    margin-right: 0.2em;
  }
`;

const DetailRouteSegments = styled(RouteSegments)`
  text-decoration: initial;
  overflow: hidden;
  grid-area: 3 / 1 / 4 / 5;
`;

const Products = styled.span`
  font-size: 0.9em;
  grid-area: 2 / 1 / 3 / 5;
`;

export const Route = ({ route, detail, onClick }: Props) => {
  const segmentTypes = useMemo(() => {
    if (route.segmentTypes.length > 1) return route.segmentTypes.join(' - ');

    const firstSegment = route.segments[0];

    if (!firstSegment) return null;

    return (
      <span>
        {firstSegment.train.name}
        {'plannedSequence' in firstSegment && (
          <PlannedType plannedSequence={firstSegment.plannedSequence} />
        )}
      </span>
    );
  }, [route]);

  return (
    <PaperWrap data-testid={`Route-${route.cid}`} onClick={onClick} square>
      <StyledTime real={route.departure.time} delay={route.departure.delay} />
      <StyledTime real={route.arrival.time} delay={route.arrival.delay} />
      <span>{formatDuration(route.duration)}</span>
      <span>{route.changes}</span>
      {detail ? (
        <DetailRouteSegments segments={route.segments} />
      ) : (
        <Products>{segmentTypes}</Products>
      )}
    </PaperWrap>
  );
};
