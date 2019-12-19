import { AllowedHafasProfile } from 'types/HAFAS';
import JourneyGeoPos from 'server/HAFAS/JourneyGeoPos';
import JourneyMatch from 'server/HAFAS/JourneyMatch';

export default async (trainName: string, profile?: AllowedHafasProfile) => {
  const matchedTrains = await JourneyMatch(trainName, undefined, profile);
  const train = matchedTrains[0];

  if (!train) {
    return undefined;
  }
  const geoPosMatch = await JourneyGeoPos(
    {
      onlyRT: true,
      jnyFltrL: [
        {
          mode: 'INC',
          type: 'JID',
          value: train.jid,
        },
      ],
      ring: {
        cCrd: {
          x: 10004670,
          y: 50411800,
        },
        maxDist: 1000000,
      },
    },
    profile
  );

  return geoPosMatch;
};
