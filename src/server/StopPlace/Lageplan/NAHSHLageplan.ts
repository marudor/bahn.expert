import { AllowedHafasProfile } from '@/types/HAFAS';
import { Cache, CacheDatabase } from '@/server/cache';
import { locMatch } from '@/server/HAFAS/LocMatch';
import Axios from 'axios';

const cache = new Cache<string | null>(CacheDatabase.NAHSHLageplan);

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
  try {
    const cached = await getCachedNAHSHLageplan(evaId);
    if (cached) return cached;
    if (cached === null) return undefined;

    const station = (
      await locMatch(evaId, 'S', AllowedHafasProfile['NAH.SH'])
    )[0];
    if (station) {
      const fullLink = `https://www.nah.sh/assets/downloads/Stationsplaene/${normalizeStationName(
        station.name,
      )}.pdf`;

      try {
        await Axios.get(fullLink);
        void cache.set(evaId, fullLink);
        return fullLink;
      } catch {
        // we ignore failing requests and fall back to undefined for lageplanURL
      }
    }
    void cache.set(evaId, null);
    return undefined;
  } catch {
    return undefined;
  }
}

export function getCachedNAHSHLageplan(
  evaId: string,
): Promise<string | null | undefined> {
  return cache.get(evaId);
}
