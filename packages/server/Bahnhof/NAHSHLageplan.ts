import { AllowedHafasProfile } from 'types/HAFAS';
import { CacheDatabases, createNewCache } from 'server/cache';
import Axios from 'axios';
import LocMatch from 'server/HAFAS/LocMatch';

// 48 hours in seconds
const cache = createNewCache<string, string | null>(
  48 * 60 * 60,
  CacheDatabases.NAHSHLageplan,
);

function normalizeStationName(stationName: string) {
  return stationName
    .replace(' AKN', '')
    .replace('ü', 'ue')
    .replace('Ü', 'Ue')
    .replace('ä', 'ae')
    .replace('Ä', 'Ae')
    .replace('ü', 'ue')
    .replace('Ü', 'Ue')
    .replace(' ', '_');
}

export async function getNAHSHLageplan(
  evaId: string,
): Promise<string | undefined> {
  const cached = await getCachedNAHSHLageplan(evaId);
  if (cached) return cached;
  if (cached === null) return undefined;

  const station = (
    await LocMatch(evaId, 'S', AllowedHafasProfile['NAH.SH'])
  )[0];
  if (station) {
    const fullLink = `https://www.nah.sh/assets/downloads/Stationsplaene/${normalizeStationName(
      station.title,
    )}.pdf`;

    try {
      await Axios.get(fullLink);
      void cache.set(evaId, fullLink);
      return fullLink;
    } catch (e) {
      // console.error(e);
      // we ignore failing requests and fall back to undefined for lageplanURL
    }
  }
  void cache.set(evaId, null);
  return undefined;
}

export function getCachedNAHSHLageplan(
  evaId: string,
): Promise<string | null | undefined> {
  return cache.get(evaId);
}
