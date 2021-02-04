import { getWRLink, wagenreihung } from 'server/Reihung';
import { parse } from 'date-fns';
import Axios from 'axios';
import type { Formation } from 'types/reihung';

const getPossibleWRs = async (): Promise<string[] | undefined> => {
  try {
    await Axios.get(getWRLink('1', new Date(), 'apps'));
  } catch (e) {
    const tryThese = e.response?.data?.tryThese;
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
): Promise<Formation | undefined> => {
  const tryThese = await getPossibleWRs();
  const triedNumbers: string[] = [];
  if (tryThese) {
    for (const line of tryThese) {
      const [, number, time] = line.split('/');
      if (number.length > 4 || triedNumbers.includes(number)) continue;
      const parsedNumber = Number.parseInt(number, 10);
      if (parsedNumber > 3000 && parsedNumber < 9000) continue;
      try {
        console.log(`Check if TZN${TZNumber} is today ${number}`);
        const wr = await wagenreihung(
          number,
          parse(time, 'yyyyMMddHHmm', Date.now()),
        );
        triedNumbers.push(number);
        if (wr.allFahrzeuggruppe.some((g) => g.tzn === TZNumber)) {
          console.log(`TZ ${TZNumber} today as ${number}`);

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
): Promise<Formation | undefined> => {
  const tryThese = await getPossibleWRs();
  if (tryThese) {
    const relevantLines = tryThese.filter((line) => {
      const [, number] = line.split('/');
      return number === trainNumber;
    });
    for (const relevantLine of relevantLines) {
      const [, , time] = relevantLine.split('/');
      try {
        const wr = await wagenreihung(
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
