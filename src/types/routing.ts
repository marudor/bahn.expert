import { ProdL } from './HAFAS';
import { SecL } from './HAFAS/TripSearch';
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
export type Route$Auslastung = {
  first?: number;
  second?: number;
};
export type Route$JourneySegmentTrain = Route$Arrival &
  Route$Departure & {
    changeDuration?: number;
    duration?: number;
    finalDestination: string;
    jid: string;
    product?: ProdL;
    raw?: SecL;
    segmentDestination: Station;
    segmentStart: Station;
    stops?: Route$Stop[];
    train: string;
    trainId?: string;
    trainNumber: string;
    trainType: string;
    auslastung?: Route$Auslastung;
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
