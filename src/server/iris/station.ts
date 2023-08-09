/* eslint no-param-reassign: 0, no-await-in-loop: 0 */
import { Cache, CacheDatabase } from '@/server/cache';
import { irisGetRequest } from './helper';
import { stationMetaFilter } from '@/server/iris/stationMetaFilter';
import xmljs from 'libxmljs2';
import type { Element } from 'libxmljs2';
import type { IrisStation, IrisStationWithRelated } from '@/types/iris';

const cache = new Cache<IrisStation | null>(CacheDatabase.Station);

export function parseStation(stationNode: xmljs.Element): IrisStation {
  const station: any = {};

  for (const a of stationNode.attrs()) {
    station[a.name()] = a.value();
  }
  station.meta = station.meta ? station.meta.split('|') : [];

  const excludeList = stationMetaFilter[station.eva];
  if (excludeList) {
    station.meta = station.meta.filter(
      (meta: string) => !excludeList.includes(meta),
    );
  }

  return station;
}

/**
 *
 * @param searchTerm Mainly eva, can also be the name
 */
export async function getSingleStation(
  searchTerm: string,
): Promise<IrisStation> {
  const cached = await cache.get(searchTerm);

  if (cached) {
    return cached;
  }
  if (cached === null) {
    throw {
      status: 404,
      error: {
        errorType: '404',
        description: 'Unbekannte Station',
      },
    };
  }
  const rawXml = await irisGetRequest<string>(
    `/station/${encodeURIComponent(searchTerm)}`,
  );

  const xml = xmljs.parseXml(rawXml);

  const xmlStation = xml.get<Element>('//station');

  if (!xmlStation) {
    void cache.set(searchTerm, null);
    throw {
      status: 404,
      error: {
        errroType: '404',
        description: 'Unbekannte Station',
      },
    };
  }
  const station = parseStation(xmlStation);

  void cache.set(searchTerm, station);

  return station;
}

export async function getStation(
  evaId: string,
): Promise<IrisStationWithRelated> {
  const station = await getSingleStation(evaId);

  const relatedStations = (
    await Promise.all(
      station.meta.map((m) =>
        getSingleStation(m).catch(() => {
          // we just set this to undefined if resolve failed
        }),
      ),
    )
  ).filter(Boolean);

  return {
    station,
    relatedStations: relatedStations.sort((s1, s2) =>
      s1.name > s2.name ? 1 : -1,
    ),
  };
}
