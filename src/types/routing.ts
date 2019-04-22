import { ProdL } from './hafas';
import { SecL } from './hafas/TripSearch';
import { Station } from './station';

export type Route$Arrival = {
  scheduledArrivalPlatform?: string;
  arrivalPlatform?: string;
  scheduledArrival?: number;
  arrival?: number;
  arrivalDelay?: number;
};

export type Route$Departure = {
  scheduledDeparturePlatform?: string;
  departurePlatform?: string;
  scheduledDeparture?: number;
  departure?: number;
  departureDelay?: number;
};

export type Route$Stop = {
  station: Station;
  scheduledDeparturePlatform?: string;
  departurePlatform?: string;
  // +scheduledDeparture?: number,
  departure?: number;
  departureDelay?: number;
  scheduledArrivalPlatform?: string;
  arrivalPlatform?: string;
  // +scheduledArrival?: number,
  arrival?: number;
  arrivalDelay?: number;
};
export type Route$JourneySegment = Route$JourneySegmentTrain;
export type Route$JourneySegmentTrain = Route$Arrival &
  Route$Departure & {
    train: string;
    trainId?: string;
    trainNumber: string;
    trainType: string;
    changeDuration?: number;
    segmentStart: Station;
    segmentDestination: Station;
    stops?: Route$Stop[];
    duration?: number;
    finalDestination: string;
    raw?: SecL;
    product?: ProdL;
  };

export type Route = Route$Arrival &
  Route$Departure & {
    cid: string;
    date: number;
    duration: number;
    changes: number;
    segments: Route$JourneySegment[];
    segmentTypes: Array<string>;
    raw?: any;
  };
