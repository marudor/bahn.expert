import { getSingleJourneyTrip } from '@/server/sbb/trip';
import { getStopPlaceByEva } from '@/server/StopPlace/search';
import { logger } from '@/server/logger';
import { sbbAxios } from '@/server/sbb/sbbAxios';
import type { SBBCoachSequenceWithTrip } from '@/server/sbb/types';

function getCoachSequenceRequest(
  originId: string,
  destinationId: string,
  tripId: string,
) {
  return {
    operationName: 'getTrainFormation',
    variables: {
      originId,
      destinationId,
      tripId,
      language: 'DE',
    },
    query:
      'query getTrainFormation($originId: ID!, $destinationId: ID!, $tripId: ID!, $language: LanguageEnum!) {\n  trainFormation(\n    originId: $originId\n    destinationId: $destinationId\n    tripId: $tripId\n    language: $language\n  ) {\n    originFormation {\n      trainGroups {\n        sections {\n          name\n          cars {\n            ...CarsFields\n            __typename\n          }\n          __typename\n        }\n        destination\n        __typename\n      }\n      leavingDirection\n      stationName\n      __typename\n    }\n    destinationFormation {\n      trainGroups {\n        sections {\n          name\n          cars {\n            ...CarsFields\n            __typename\n          }\n          __typename\n        }\n        destination\n        __typename\n      }\n      leavingDirection\n      stationName\n      __typename\n    }\n    legendItems {\n      id\n      text\n      icon\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment CarsFields on TrainFormationCar {\n  type\n  number\n  carUic\n  class\n  occupancy\n  attributes\n  closed\n  previousPassage\n  nextPassage\n  __typename\n}',
  };
}

export async function fetchSBBCoachSequence(
  evaNumber: string,
  trainNumber: string,
  departureTime: Date,
  lastArrivalEva: string,
): Promise<SBBCoachSequenceWithTrip | undefined> {
  const [depStopPlace, lastArrivalStopPlace] = await Promise.all([
    getStopPlaceByEva(evaNumber, true),
    getStopPlaceByEva(lastArrivalEva, true),
  ]);
  logger.debug(
    {
      depStopPlace,
      lastArrivalStopPlace,
    },
    'Found stopPlaces for coachSequenceTrip (from DB)',
  );
  if (!lastArrivalStopPlace || !depStopPlace) {
    return undefined;
  }
  const trip = await getSingleJourneyTrip(
    depStopPlace,
    lastArrivalStopPlace,
    trainNumber,
    departureTime,
  );
  const tripId = trip?.id;
  const originId = trip?.legs[0]?.start.id;
  const destinationId = trip?.legs[0]?.end.id;

  if (!tripId || !originId || !destinationId) {
    return undefined;
  }

  const data = getCoachSequenceRequest(originId, destinationId, tripId);

  const result = (await sbbAxios.post('/', data)).data;

  if (result) {
    return {
      sequence: result,
      trip,
    };
  }
}
