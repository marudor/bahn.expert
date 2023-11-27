import { checkSecrets } from '@/server/checkSecret';
import { Configuration as CoachSequenceConfiguration } from '@/external/generated/coachSequence';
import { Configuration as RisJourneysConfiguration } from '@/external/generated/risJourneys';
import { Configuration as RisStationsConfiguration } from '@/external/generated/risStations';

export const risStationsConfiguration = new RisStationsConfiguration({
  basePath: process.env.RIS_STATIONS_URL,
  baseOptions: {
    headers: {
      'user-agent': process.env.USER_AGENT || 'bahnhofs-abfahrten-default',
      'DB-Api-Key': process.env.RIS_STATIONS_CLIENT_SECRET,
      'DB-Client-Id': process.env.RIS_STATIONS_CLIENT_ID,
    },
  },
});

checkSecrets(
  process.env.RIS_STATIONS_URL,
  process.env.RIS_STATIONS_CLIENT_SECRET,
  process.env.RIS_STATIONS_CLIENT_ID,
);

export const getRisJourneysConfiguration = (
  clientId: string,
  clientSecret: string,
): RisJourneysConfiguration =>
  new RisJourneysConfiguration({
    basePath: process.env.RIS_JOURNEYS_URL,
    baseOptions: {
      headers: {
        'DB-Api-Key': clientSecret,
        'DB-Client-Id': clientId,
      },
    },
  });

checkSecrets(
  process.env.RIS_JOURNEYS_URL,
  process.env.RIS_JOURNEYS_CLIENT_SECRET,
  process.env.RIS_JOURNEYS_CLIENT_ID,
);

export const coachSequenceConfiguration = new CoachSequenceConfiguration({
  basePath: process.env.COACH_SEQUENCE_URL,
  baseOptions: {
    headers: {
      'DB-Api-Key': process.env.COACH_SEQUENCE_CLIENT_SECRET,
      'DB-Client-Id': process.env.COACH_SEQUENCE_CLIENT_ID,
    },
  },
});

checkSecrets(
  process.env.COACH_SEQUENCE_URL,
  process.env.COACH_SEQUENCE_CLIENT_SECRET,
  process.env.COACH_SEQUENCE_CLIENT_ID,
);
