import { getDBLageplan } from './DBLageplan';
import { getHVVLageplan } from './HVVLageplan';
import { getNAHSHLageplan } from './NAHSHLageplan';

export async function getLageplan(
  stationName: string,
  evaId: string,
): Promise<string | undefined> {
  const [DBLageplan, HVVLageplan, NahSHLageplan] = await Promise.all([
    getDBLageplan(stationName),
    getHVVLageplan(evaId),
    getNAHSHLageplan(evaId),
  ]);

  return DBLageplan || HVVLageplan || NahSHLageplan;
}
