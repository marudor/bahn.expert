import { additionalJourneyInformation } from 'server/journeys/additionalJourneyInformation';
import { addUseragent } from 'business-hub/randomUseragent';
import { Cache, CacheDatabase } from 'server/cache';
import { differenceInHours, format } from 'date-fns';
import { JourneysApi, TransportType } from 'business-hub/generated/risJourneys';
import { risJourneysConfiguration } from 'business-hub/config';
import { upstreamApiCountInterceptor } from 'server/admin';
import axios from 'axios';
import type {
  JourneyEventBased,
  JourneyMatch,
  StationShort,
  TransportPublic,
} from 'business-hub/generated/risJourneys';
import type { ParsedJourneyMatchResponse } from 'types/HAFAS/JourneyMatch';
import type { ParsedProduct } from 'types/HAFAS';
import type { Route$Stop } from 'types/routing';

const journeyFindCache = new Cache<string, JourneyMatch[]>(
  CacheDatabase.JourneyFind,
  8 * 60 * 60,
);

const axiosWithTimeout = axios.create({
  timeout: 4500,
});
axiosWithTimeout.interceptors.request.use(
  addUseragent.bind(
    undefined,
    process.env.RIS_JOURNEYS_USER_AGENT
      ? () => process.env.RIS_JOURNEYS_USER_AGENT!
      : undefined,
  ),
);
axiosWithTimeout.interceptors.request.use(
  upstreamApiCountInterceptor.bind(undefined, 'ris-journeys'),
);

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
  originEvaNumber?: string,
): Promise<JourneyMatch[]> {
  try {
    const isWithin20Hours = date && differenceInHours(date, Date.now()) <= 20;
    const cacheKey = `${trainNumber}|${category}|${
      date && format(date, 'yyyy-MM-dd')
    }|${onlyFv ?? false}|${originEvaNumber}`;
    if (isWithin20Hours) {
      const cacheHit = await journeyFindCache.get(cacheKey);
      if (cacheHit) {
        return cacheHit;
      }
    }
    const result = await risJourneysClient.find({
      number: trainNumber,
      // TODO: Kategorie ist manchmal schwierig, z.B. RE 11 / IC 5107 Luxemburg -> Düsseldorf
      category,
      date: date && format(date, 'yyyy-MM-dd'),
      transports: onlyFv ? longDistanceTypes : undefined,
      originEvaNumber,
    });

    if (isWithin20Hours) {
      void journeyFindCache.set(cacheKey, result.data.journeys);
    }

    for (const j of result.data.journeys) {
      void additionalJourneyInformation(
        `${j.transport.category} ${j.transport.number}`,
        j.journeyID,
        j.originSchedule.evaNumber,
        new Date(j.date),
      );
    }

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

export async function getJourneyDetails(
  journeyId: string,
): Promise<JourneyEventBased | undefined> {
  try {
    const r = await risJourneysClient.journeyEventbasedById({
      journeyID: journeyId,
      includeJourneyReferences: true,
    });

    return r.data;
  } catch {
    return undefined;
  }
}
