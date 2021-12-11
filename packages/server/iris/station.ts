/* eslint no-param-reassign: 0, no-await-in-loop: 0 */
import { CacheDatabases, createNewCache } from 'server/cache';
import { irisGetRequest } from './helper';
import { stationMetaFilter } from 'server/iris/stationMetaFilter';
import xmljs from 'libxmljs2';
import type { Element } from 'libxmljs2';
import type { IrisStation, IrisStationWithRelated } from 'types/iris';

// 4 Hours in seconds
const cache = createNewCache<string, IrisStation | null>(
  4 * 60 * 60,
  CacheDatabases.Station,
);

export function parseStation(stationNode: xmljs.Element): IrisStation {
  const station: any = {};

  stationNode.attrs().forEach((a) => {
    station[a.name()] = a.value();
  });
  if (station.meta) {
    station.meta = station.meta.split('|');
  } else {
    station.meta = [];
  }

  const excludeList = stationMetaFilter[station.eva];
  if (excludeList) {
    station.meta = station.meta.filter(
      (meta: string) => !excludeList.includes(meta),
    );
  }

  return station;
}

export async function getSingleStation(evaId: string): Promise<IrisStation> {
  const cached = await cache.get(evaId);

  if (cached) {
    return cached;
  }
  if (cached === null) {
    throw {
      status: 404,
      error: {
        errroType: '404',
        description: 'Unbekannte Station',
      },
    };
  }
  const rawXml = await irisGetRequest<string>(`/station/${evaId}`);

  const xml = xmljs.parseXml(rawXml);

  const xmlStation = xml.get<Element>('//station');

  if (!xmlStation) {
    void cache.set(evaId, null);
    throw {
      status: 404,
      error: {
        errroType: '404',
        description: 'Unbekannte Station',
      },
    };
  }
  const station = parseStation(xmlStation);

  void cache.set(evaId, station);

  return station;
}

export async function getStation(
  evaId: string,
  recursive = 0,
): Promise<IrisStationWithRelated> {
  const station = await getSingleStation(evaId);
  let queue = station.meta;
  const seen = [station.eva];
  const relatedStations: IrisStation[] = [];

  while (recursive > 0 && queue.length) {
    recursive -= 1;
    queue = (
      await Promise.all(
        queue.map(async (id) => {
          if (seen.includes(id)) {
            return [];
          }
          seen.push(id);
          const station = await getSingleStation(id);

          relatedStations.push(station);

          return station.meta;
        }),
      )
    ).flat();
  }

  return {
    station,
    relatedStations: relatedStations.sort((s1, s2) =>
      s1.name > s2.name ? 1 : -1,
    ),
  };
}
