import { additionalJourneyInformation } from '@/server/journeys/additionalJourneyInformation';
import { addUseragent } from '@/external/randomUseragent';
import { Cache, CacheDatabase } from '@/server/cache';
import { differenceInHours, format } from 'date-fns';
import { JourneysApi, TransportType } from '@/external/generated/risJourneys';
import { logger } from '@/server/logger';
import { risJourneysConfiguration } from '@/external/config';
import { upstreamApiCountInterceptor } from '@/server/admin';
import axios from 'axios';
import type {
  JourneyEventBased,
  JourneyMatch,
  StopPlaceEmbedded,
  TransportPublic,
} from '@/external/generated/risJourneys';
import type { ParsedJourneyMatchResponse } from '@/types/HAFAS/JourneyMatch';
import type { ParsedProduct } from '@/types/HAFAS';
import type { Route$Stop } from '@/types/routing';

const journeyFindCache = new Cache<JourneyMatch[]>(CacheDatabase.JourneyFind);

const journeyCache = new Cache<JourneyEventBased>(CacheDatabase.Journey);

logger.info(
  `using ${process.env.RIS_JOURNEYS_USER_AGENT} as RIS::Journeys UserAgent`,
);

const axiosWithTimeout = axios.create({
  timeout: 6500,
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

const mapStationShortToRouteStops = (
  station: StopPlaceEmbedded,
): Route$Stop => ({
  station,
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
  administration?: string,
): Promise<JourneyMatch[]> {
  try {
    const isWithin20Hours = date && differenceInHours(date, Date.now()) <= 20;
    // some EVUs (Looking at you DB FV) might not be available for >20h, others are.
    if (!isWithin20Hours) {
      return [];
    }

    const cacheKey = `${trainNumber}|${category}|${
      date && format(date, 'yyyy-MM-dd')
    }|${onlyFv ?? false}|${originEvaNumber}`;

    const cacheHit = await journeyFindCache.get(cacheKey);
    if (cacheHit) {
      return cacheHit;
    }
    const result = await risJourneysClient.find({
      number: trainNumber,
      // Kategorie ist schwierig, wir filtern quasi optional
      // category,
      date: date && format(date, 'yyyy-MM-dd'),
      transports: onlyFv ? longDistanceTypes : undefined,
      originEvaNumber,
      administrationID: administration,
    });

    if (category) {
      const categoryFiltered = result.data.journeys.filter(
        (j) => j.transport.category.toLowerCase() === category.toLowerCase(),
      );
      if (categoryFiltered.length) {
        result.data.journeys = categoryFiltered;
      }
    }

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
    if (!process.env.RIS_JOURNEYS_CACHE_DISABLED) {
      const cached = await journeyCache.get(journeyId);
      if (cached) {
        return cached;
      }
    }
    const r = await risJourneysClient.journeyEventBasedById({
      journeyID: journeyId,
      includeJourneyReferences: true,
      includeCanceled: true,
    });

    if (!process.env.RIS_JOURNEYS_CACHE_DISABLED) {
      void journeyCache.set(journeyId, r.data);
    }

    return r.data;
  } catch {
    return undefined;
  }
}
