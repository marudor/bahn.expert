import { Route$JourneySegment } from 'types/routing';
import React, { MouseEvent, useState } from 'react';
import RouteSegment from './RouteSegment';

interface Props {
  segments: Route$JourneySegment[];
  className?: string;
}

const RouteSegments = ({ segments, className }: Props) => {
  const [detail, setDetail] = useState<undefined | string>();

  return (
    <div className={className}>
      {segments.map((s, i) => (
        <RouteSegment
          detail={detail === s.train.name}
          onTrainClick={
            s.type === 'JNY'
              ? (e: MouseEvent) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setDetail(detail === s.train.name ? undefined : s.train.name);
                }
              : undefined
          }
          key={i}
          segment={s}
        />
      ))}
    </div>
  );
};

export default RouteSegments;
