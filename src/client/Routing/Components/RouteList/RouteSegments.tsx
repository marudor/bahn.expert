import { Route$JourneySegmentTrain } from 'types/routing';
import React, { useState } from 'react';
import RouteSegment from './RouteSegment';

type OwnProps = {
  segments: Route$JourneySegmentTrain[];
  className?: string;
};

const RouteSegments = ({ segments, className }: OwnProps) => {
  const [detail, setDetail] = useState<undefined | string>();

  return (
    <div className={className}>
      {segments.map(s => (
        <RouteSegment
          detail={detail === s.train.full}
          onTrainClick={() =>
            setDetail(detail === s.train.full ? undefined : s.train.full)
          }
          key={s.train.full}
          segment={s}
        />
      ))}
    </div>
  );
};

export default RouteSegments;
