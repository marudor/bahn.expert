import { AuslastungsValue } from '@/types/routing';
import { format } from 'date-fns';
import axios from 'axios';
import type { EvaNumber } from '@/types/common';
import type { Route$Auslastung } from '@/types/routing';

function getJourneyDetailsRequest(jid: string) {
  return {
    operationName: 'getServiceJourneyById',
    variables: { id: jid, language: 'DE' },
    query:
      'query getServiceJourneyById($id: ID!, $language: LanguageEnum!) {\n  serviceJourneyById(id: $id, language: $language) {\n    id\n    stopPoints {\n      stopStatus\n      stopStatusFormatted\n      arrival {\n        time\n        delay\n        __typename\n      }\n      departure {\n        time\n        delay\n        __typename\n      }\n      accessibilityBoardingAlighting {\n        limitation\n        __typename\n      }\n      occupancy {\n        firstClass\n        secondClass\n        __typename\n      }\n      place {\n        id\n        name\n        __typename\n      }\n      arrival {\n        quayAimedName\n        time\n        quayRtName\n        quayChanged\n        __typename\n      }\n      departure {\n        quayAimedName\n        quayRtName\n        time\n        quayChanged\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}',
  };
}

function getStopPlaceRequest(name: string) {
  return {
    operationName: 'GetPlaces',
    variables: { input: { type: 'NAME', value: name }, language: 'DE' },
    query:
      'query GetPlaces($input: PlaceInput, $language: LanguageEnum!) {\n  places(input: $input, language: $language) {\n    id\n    name\n    __typename\n  }\n}',
  };
}

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

async function getJourneyDetails(jid: string) {
  const data = getJourneyDetailsRequest(jid);

  const result = (
    await axios.post('https://graphql.beta.sbb.ch/', data, {
      headers: {
        'apollographql-client-name': 'sbb-webshop',
      },
    })
  ).data;

  return result;
}

async function findStopPlaceId(name: string) {
  const data = getStopPlaceRequest(name);

  const result = (
    await axios.post('https://graphql.beta.sbb.ch/', data, {
      headers: {
        'apollographql-client-name': 'sbb-webshop',
      },
    })
  ).data;

  const exactMatch = result.data?.places.find((s: any) => s.name === name);

  return exactMatch?.id;
}

async function findJourneyId(
  startName: string,
  destinationName: string,
  trainNumber: string,
  departureTime: Date,
) {
  const [startId, destinationId] = await Promise.all([
    findStopPlaceId(startName),
    findStopPlaceId(destinationName),
  ]);

  const data = getTripRequest(startId, destinationId, departureTime);

  const result = (
    await axios.post('https://graphql.beta.sbb.ch/', data, {
      headers: {
        'apollographql-client-name': 'sbb-webshop',
      },
    })
  ).data;

  const correctTrip = result.data?.trips.trips.find((t: any) =>
    t.legs[0].serviceJourney.serviceProducts.some(
      (p: any) => p.number === trainNumber,
    ),
  );

  return correctTrip.legs[0].serviceJourney.id;
}

function mapSBBOccupancy(sbbOccupancy: string): AuslastungsValue | undefined {
  switch (sbbOccupancy) {
    case 'LOW': {
      return AuslastungsValue.Gering;
    }
    case 'MEDIUM': {
      return AuslastungsValue.Hoch;
    }
    case 'HIGH': {
      return AuslastungsValue.SehrHoch;
    }
    case 'UNKNOWN': {
      return undefined;
    }
  }
}

export async function getOccupancy(
  startName: string,
  destinationName: string,
  trainNumber: string,
  departureTime: Date,
): Promise<Record<EvaNumber, Route$Auslastung>> {
  try {
    const journeyId = await findJourneyId(
      startName,
      destinationName,
      trainNumber,
      departureTime,
    );

    const details = await getJourneyDetails(journeyId);

    const occupancyRecord: Record<EvaNumber, Route$Auslastung> = {};

    for (const stopPoint of details?.data.serviceJourneyById.stopPoints ?? []) {
      const occupancy: Route$Auslastung = {
        first: mapSBBOccupancy(stopPoint.occupancy.firstClass),
        second: mapSBBOccupancy(stopPoint.occupancy.secondClass),
      };

      if (occupancy.first || occupancy.second) {
        occupancyRecord[stopPoint.place.id] = occupancy;
      }
    }

    return occupancyRecord;
  } catch {
    return {};
  }
}
