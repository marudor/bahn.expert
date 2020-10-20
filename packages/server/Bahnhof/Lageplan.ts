import { getDBLageplan } from 'server/Bahnhof/DBLageplan';
import { getHVVLageplan } from 'server/Bahnhof/HVVLageplan';
import { getNAHSHLageplan } from 'server/Bahnhof/NAHSHLageplan';

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
