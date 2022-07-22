import { coachSequence } from 'server/coachSequence';
import { getDBCoachSequenceUrl } from 'server/coachSequence/DB';
import { parse } from 'date-fns';
import Axios from 'axios';
import type { CoachSequenceInformation } from 'types/coachSequence';

const getPossibleWRs = async (): Promise<string[] | undefined> => {
  try {
    await Axios.get(getDBCoachSequenceUrl('1', new Date(), 'noncd'));
  } catch (error: any) {
    const tryThese = error.response?.data?.tryThese;
    if (tryThese && Array.isArray(tryThese)) {
      return tryThese;
    }
  }
};

/**
 *
 * @param TZNumber only the number
 */
export const WRForTZ = async (
  TZNumber: string,
): Promise<CoachSequenceInformation | undefined> => {
  const tryThese = await getPossibleWRs();
  const triedNumbers: string[] = [];
  if (tryThese) {
    for (const line of tryThese) {
      const [, number, time] = line.split('/');
      if (number.length > 4 || triedNumbers.includes(number)) continue;
      const parsedNumber = Number.parseInt(number, 10);
      if (parsedNumber > 3000 && parsedNumber < 9000) continue;
      try {
        const wr = await coachSequence(
          number,
          parse(time, 'yyyyMMddHHmm', Date.now()),
        );
        triedNumbers.push(number);
        if (wr?.sequence.groups.some((g) => g.name.endsWith(TZNumber))) {
          return wr;
        }
      } catch {
        // we ignore this
      }
    }
  }
};

export const WRForNumber = async (
  trainNumber: string,
): Promise<CoachSequenceInformation | undefined> => {
  const tryThese = await getPossibleWRs();
  if (tryThese) {
    const relevantLines = tryThese.filter((line) => {
      const [, number] = line.split('/');
      return number === trainNumber;
    });
    for (const relevantLine of relevantLines) {
      const time = relevantLine.split('/')[2];
      try {
        const wr = await coachSequence(
          trainNumber,
          parse(time, 'yyyyMMddHHmm', Date.now()),
        );

        return wr;
      } catch {
        // we ignore fails here, might work for next relevantLine
      }
    }
  }
};
