import { Cache, CacheDatabase } from '@/server/cache';
import { findSingleStopPlace } from '@/server/sbb/stopPlace';
import { format } from 'date-fns';
import { getStopPlaceByEva } from '@/server/StopPlace/search';
import { logger } from '@/server/logger';
import { sbbAxios } from '@/server/sbb/sbbAxios';
import type { MinimalStopPlace } from '@/types/stopPlace';
import type { SBBTrip } from '@/server/sbb/types';

const tripCache = new Cache<SBBTrip>(CacheDatabase.SBBTrip);

function getTripRequest(
  startId: string,
  destinationId: string,
  departureTime: Date,
) {
  return {
    operationName: 'getTrips',
    variables: {
      input: {
        places: [
          { type: 'ID', value: startId },
          { type: 'ID', value: destinationId },
        ],
        time: {
          date: format(departureTime, 'yyyy-MM-dd'),
          time: format(departureTime, 'HH:mm'),
          type: 'DEPARTURE',
        },
        includeEconomic: false,
        directConnection: true,
        includeAccessibility: 'ALL',
        includeNoticeAttributes: [],
        includeTransportModes: [
          'HIGH_SPEED_TRAIN',
          'INTERCITY',
          'INTERREGIO',
          'REGIO',
          'URBAN_TRAIN',
          'SPECIAL_TRAIN',
          'SHIP',
          'BUS',
          'TRAMWAY',
          'CABLEWAY_GONDOLA_CHAIRLIFT_FUNICULAR',
        ],
        includeUnsharp: false,
        occupancy: 'ALL',
        walkSpeed: 100,
      },
      language: 'DE',
    },
    query:
      'query getTrips($input: TripInput!, $pagingCursor: String, $language: LanguageEnum!) {\n  trips(tripInput: $input, pagingCursor: $pagingCursor, language: $language) {\n    trips {\n      id\n      legs {\n        duration\n        id\n        ... on AccessLeg {\n          __typename\n          duration\n          distance\n          start {\n            __typename\n            id\n            name\n          }\n          end {\n            __typename\n            id\n            name\n          }\n        }\n        ... on PTConnectionLeg {\n          __typename\n          duration\n          start {\n            id\n            name\n            __typename\n          }\n          end {\n            id\n            name\n            __typename\n          }\n          notices {\n            ...NoticesFields\n            __typename\n          }\n        }\n        ... on AlternativeModeLeg {\n          __typename\n          mode\n          duration\n        }\n        ... on PTRideLeg {\n          __typename\n          duration\n          start {\n            id\n            name\n            __typename\n          }\n          end {\n            id\n            name\n            __typename\n          }\n          arrival {\n            ...ArrivalDepartureFields\n            __typename\n          }\n          departure {\n            ...ArrivalDepartureFields\n            __typename\n          }\n          serviceJourney {\n            id\n            stopPoints {\n              place {\n                id\n                name\n                __typename\n              }\n              occupancy {\n                firstClass\n                secondClass\n                __typename\n              }\n              accessibilityBoardingAlighting {\n                limitation\n                name\n                description\n                assistanceService {\n                  template\n                  arguments {\n                    type\n                    values\n                    __typename\n                  }\n                  __typename\n                }\n                __typename\n              }\n              stopStatus\n              stopStatusFormatted\n              __typename\n            }\n            serviceProducts {\n              name\n              line\n              number\n              vehicleMode\n              vehicleSubModeShortName\n              corporateIdentityIcon\n              routeIndexFrom\n              routeIndexTo\n              __typename\n            }\n            direction\n            serviceAlteration {\n              cancelled\n              cancelledText\n              partiallyCancelled\n              partiallyCancelledText\n              redirected\n              redirectedText\n              reachable\n              reachableText\n              delayText\n              unplannedStopPointsText\n              quayChangedText\n              __typename\n            }\n            situations {\n              cause\n              broadcastMessages {\n                id\n                priority\n                title\n                detail\n                detailShort\n                distributionPeriod {\n                  startDate\n                  endDate\n                  __typename\n                }\n                __typename\n              }\n              affectedStopPointFromIdx\n              affectedStopPointToIdx\n              __typename\n            }\n            notices {\n              ...NoticesFields\n              __typename\n            }\n            quayTypeName\n            quayTypeShortName\n            __typename\n          }\n        }\n        __typename\n      }\n      situations {\n        cause\n        broadcastMessages {\n          id\n          priority\n          title\n          detail\n          __typename\n        }\n        affectedStopPointFromIdx\n        affectedStopPointToIdx\n        __typename\n      }\n      notices {\n        ...NoticesFields\n        __typename\n      }\n      valid\n      summary {\n        duration\n        arrival {\n          ...ArrivalDepartureFields\n          __typename\n        }\n        arrivalWalk\n        lastStopPlace {\n          id\n          name\n          __typename\n        }\n        tripStatus {\n          alternative\n          alternativeText\n          cancelledText\n          __typename\n        }\n        departure {\n          ...ArrivalDepartureFields\n          __typename\n        }\n        departureWalk\n        firstStopPlace {\n          id\n          name\n          __typename\n        }\n        product {\n          name\n          line\n          number\n          vehicleMode\n          vehicleSubModeShortName\n          corporateIdentityIcon\n          __typename\n        }\n        direction\n        occupancy {\n          firstClass\n          secondClass\n          __typename\n        }\n        tripStatus {\n          cancelled\n          partiallyCancelled\n          delayed\n          delayedUnknown\n          quayChanged\n          __typename\n        }\n        boardingAlightingAccessibility\n        international\n        __typename\n      }\n      searchHint\n      __typename\n    }\n    paginationCursor {\n      previous\n      next\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment NoticesFields on Notice {\n  name\n  text {\n    template\n    arguments {\n      type\n      values\n      __typename\n    }\n    __typename\n  }\n  type\n  priority\n  __typename\n}\n\nfragment ArrivalDepartureFields on ScheduledStopPointDetail {\n  time\n  delay\n  delayText\n  quayAimedName\n  quayRtName\n  quayChanged\n  quayChangedText\n  __typename\n}',
  };
}

export async function getSingleJourneyTrip(
  start: Omit<MinimalStopPlace, 'ril100'>,
  destination: Omit<MinimalStopPlace, 'ril100'>,
  trainNumber: string,
  departureTime: Date,
): Promise<SBBTrip | undefined> {
  const cacheKey = `${start.evaNumber}-${
    destination.evaNumber
  }-${trainNumber}-${departureTime.toISOString()}`;
  const cached = await tripCache.get(cacheKey);
  if (cached) {
    return cached;
  }
  const [startStopPlace, destinationStopPlace] = await Promise.all([
    getStopPlaceByEva(start.evaNumber),
    getStopPlaceByEva(destination.evaNumber),
  ]);

  const startUIC =
    startStopPlace?.uic ?? (await findSingleStopPlace(start))?.id;
  const destinationUIC =
    destinationStopPlace?.uic ?? (await findSingleStopPlace(destination))?.id;

  logger.debug(
    {
      startUIC,
      destinationUIC,
    },
    'Found UICs for coachSequenceTrip',
  );

  if (!startUIC || !destinationUIC) {
    return undefined;
  }

  const data = getTripRequest(startUIC, destinationUIC, departureTime);

  const result = (await sbbAxios.post('https://graphql.beta.sbb.ch/', data))
    .data;

  const correctTrip = result.data?.trips.trips.find((t: any) =>
    t.legs[0].serviceJourney.serviceProducts.some(
      (p: any) => p.number === trainNumber,
    ),
  );

  if (correctTrip) {
    void tripCache.set(cacheKey, correctTrip);
  }

  return correctTrip;
}
