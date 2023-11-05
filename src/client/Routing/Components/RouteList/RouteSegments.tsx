import { RouteSegment } from './RouteSegment';
import { useState } from 'react';
import type { FC, MouseEvent } from 'react';
import type { RouteJourneySegment } from '@/types/routing';

interface Props {
  segments: RouteJourneySegment[];
  className?: string;
}

export const RouteSegments: FC<Props> = ({ segments, className }) => {
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
