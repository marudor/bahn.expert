// @flow
import React, { useState } from 'react';
import RouteSegment from './RouteSegment';
import type { Route$JourneySegmentTrain } from 'types/routing';

type OwnProps = {|
  segments: Route$JourneySegmentTrain[],
  className?: string,
|};

const RouteSegments = ({ segments, className }: OwnProps) => {
  const [detail, setDetail] = useState<?string>();

  return (
    <div className={className}>
      {segments.map(s => (
        <RouteSegment
          detail={detail === s.train}
          onTrainClick={() =>
            setDetail(detail === s.train ? undefined : s.train)
          }
          key={s.train}
          segment={s}
        />
      ))}
    </div>
  );
};

export default RouteSegments;
