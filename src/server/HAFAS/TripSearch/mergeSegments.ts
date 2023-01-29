import type { Route$JourneySegment } from '@/types/routing';

export default (segments: Route$JourneySegment[]): Route$JourneySegment[] => {
  const mergedSegments: Route$JourneySegment[] = [];
  let currentSegment = segments.shift();

  while (currentSegment) {
    const nextSegment = segments.shift();

    if (currentSegment.type !== 'WALK' || !nextSegment) {
      mergedSegments.push(currentSegment);
      currentSegment = nextSegment;
    } else if (nextSegment.type !== 'WALK') {
      mergedSegments.push(currentSegment, nextSegment);
      currentSegment = segments.shift();
    } else {
      currentSegment.arrival = nextSegment.arrival;
      currentSegment.duration += nextSegment.duration;
      currentSegment.segmentDestination = nextSegment.segmentDestination;
      mergedSegments.push(currentSegment);
      currentSegment = segments.shift();
    }
  }

  return mergedSegments;
};
