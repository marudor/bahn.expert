import { getDBLageplan } from './DBLageplan';
import { getNAHSHLageplan } from './NAHSHLageplan';

export async function getLageplan(
  stationName: string,
  evaId: string,
): Promise<string | undefined> {
  const [DBLageplan, NahSHLageplan] = await Promise.all([
    getDBLageplan(stationName),
    getNAHSHLageplan(evaId),
  ]);

  return DBLageplan || NahSHLageplan;
}
