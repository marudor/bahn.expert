// @flow
import { format } from 'date-fns';
import { formatDuration } from 'Routing/util';
import React from 'react';
import type { Route$JourneySegment } from 'types/routing';

type OwnProps = {|
  segment: Route$JourneySegment,
|};
type Props = OwnProps;
const RouteSegment = ({ segment }: Props) => (
  <div>
    <span>{segment.train}</span>
    <div>
      <div>
        <span>Departure Station</span>
        <span>{segment.segmentStart.title}</span>
      </div>
      <div>
        <span>Departure (scheduled)</span>
        <span>{format(segment.scheduledDeparture, 'HH:mm')}</span>
      </div>
      <div>
        <span>Departure</span>
        <span>{format(segment.departure, 'HH:mm')}</span>
      </div>
      <div>
        <span>Departure Platform</span>
        <span>{segment.scheduledDeparturePlatform}</span>
      </div>
      <div>
        <span>Arrival Station</span>
        <span>{segment.segmentDestination.title}</span>
      </div>
      <div>
        <span>Arrival (scheduled)</span>
        <span>{format(segment.scheduledArrival, 'HH:mm')}</span>
      </div>
      <div>
        <span>Arrival</span>
        <span>{format(segment.arrival, 'HH:mm')}</span>
      </div>
      <div>
        <span>Arrival Platform</span>
        <span>{segment.scheduledArrivalPlatform}</span>
      </div>
      <div>
        <span>Duration</span>
        <span>{formatDuration(segment.duration)}</span>
      </div>
      <div>
        <span>Train Destination</span>
        <span>{segment.finalDestination}</span>
      </div>
    </div>
  </div>
);

export default RouteSegment;
