// @flow
import React from 'react';
import RouteSegment from './RouteSegment';
import type { Route$JourneySegmentTrain } from 'types/routing';

type DispatchProps = {||};
type OwnProps = {|
  segments: Route$JourneySegmentTrain[],
  className?: string,
|};
type StateProps = {||};
type ReduxProps = {|
  ...DispatchProps,
  ...OwnProps,
  ...StateProps,
|};
type Props = {|
  ...ReduxProps,
|};

const RouteSegments = ({ segments, className }: Props) => (
  <div className={className}>
    {segments.map(s => (
      <RouteSegment key={s.train} segment={s} />
    ))}
  </div>
);

export default RouteSegments;
