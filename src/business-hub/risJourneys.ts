import { addRandomUseragent } from 'business-hub/randomUseragent';
import { format } from 'date-fns';
import { JourneysApi, TransportType } from 'business-hub/generated/risJourneys';
import { risJourneysConfiguration } from 'business-hub/config';
import axios from 'axios';
import type {
  JourneyMatch,
  StationShort,
  TransportPublic,
} from 'business-hub/generated/risJourneys';
import type { ParsedJourneyMatchResponse } from 'types/HAFAS/JourneyMatch';
import type { ParsedProduct } from 'types/HAFAS';
import type { Route$Stop } from 'types/routing';

const axiosWithTimeout = axios.create({
  timeout: 4500,
});
axiosWithTimeout.interceptors.request.use(addRandomUseragent);

const risJourneysClient = new JourneysApi(
  risJourneysConfiguration,
  undefined,
  axiosWithTimeout,
);

const longDistanceTypes: TransportType[] = [
  TransportType.HighSpeedTrain,
  TransportType.IntercityTrain,
];

const mapTransportToTrain = (transport: TransportPublic): ParsedProduct => ({
  name: `${transport.category} ${
    longDistanceTypes.includes(transport.type)
      ? transport.number
      : transport.line || transport.number
  }`,
  line: transport.line,
  type: transport.category,
  number: `${transport.number}`,
});

const mapStationShortToRouteStops = (station: StationShort): Route$Stop => ({
  station: {
    id: station.evaNumber,
    title: station.name,
  },
});

function mapToParsedJourneyMatchResponse(
  journeyMatch: JourneyMatch,
): ParsedJourneyMatchResponse {
  return {
    // Technically wrong!
    jid: journeyMatch.journeyID,
    train: mapTransportToTrain(journeyMatch.transport),
    stops: [],
    firstStop: mapStationShortToRouteStops(journeyMatch.originSchedule),
    lastStop: mapStationShortToRouteStops(journeyMatch.destinationSchedule),
  };
}

export async function findJourney(
  trainNumber: number,
  category?: string,
  date?: Date,
  onlyFv?: boolean,
): Promise<JourneyMatch[]> {
  try {
    const result = await risJourneysClient.find({
      number: trainNumber,
      category,
      date: date && format(date, 'yyyy-MM-dd'),
      transports: onlyFv ? longDistanceTypes : undefined,
    });

    return result.data.journeys;
  } catch {
    return [];
  }
}

export async function findJourneyHafasCompatible(
  trainNumber: number,
  category?: string,
  date?: Date,
  onlyFv?: boolean,
): Promise<ParsedJourneyMatchResponse[]> {
  const risReuslt = await findJourney(trainNumber, category, date, onlyFv);

  return risReuslt.map(mapToParsedJourneyMatchResponse);
}
