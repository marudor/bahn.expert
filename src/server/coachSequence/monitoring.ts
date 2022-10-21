import { coachSequence } from 'server/coachSequence';
import { getAbfahrten } from 'server/iris';
import type { CoachSequenceInformation } from 'types/coachSequence';

function wagenReihungSpecificMonitoring(id: string, departure: Date) {
  return coachSequence(id, departure);
}

export async function coachSequenceMonitoring(): Promise<
  CoachSequenceInformation | undefined
> {
  const abfahrten = await getAbfahrten('8002549', false, {
    lookahead: 300,
    lookbehind: 0,
  });
  const maybeDepartures = abfahrten.departures.filter(
    (d) => d.train.type === 'ICE' && d.departure,
  );

  let departure = maybeDepartures.shift();

  while (departure) {
    const departureTime =
      departure.departure && departure.departure.scheduledTime;

    if (!departureTime) {
      departure = maybeDepartures.shift();
    } else {
      try {
        // eslint-disable-next-line no-await-in-loop
        const wr = await wagenReihungSpecificMonitoring(
          departure.train.number,
          departureTime,
        );

        if (wr) return wr;
        departure = maybeDepartures.shift();
      } catch {
        // eslint-disable-next-line no-console
        // console.warn(
        //   'Failed to get WR for Monitoring!',
        //   e,
        //   departure && departure.train,
        // );
        departure = maybeDepartures.shift();
      }
    }
  }
}
