/* eslint no-param-reassign: 0, no-await-in-loop: 0 */
import { CacheDatabases, createNewCache } from 'server/cache';
import { noncdAxios } from './helper';
import xmljs, { Element } from 'libxmljs2';
import type { AxiosInstance } from 'axios';
import type { IrisStation, IrisStationWithRelated } from 'types/station';

// 4 Hours in seconds
const cache = createNewCache<string, IrisStation>(
  4 * 60 * 60,
  CacheDatabases.Station
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

  return station;
}

export async function getSingleStation(
  evaId: string,
  axios: AxiosInstance = noncdAxios
): Promise<IrisStation> {
  const cached = await cache.get(evaId);

  if (cached) {
    return cached;
  }
  const rawXml = (await axios.get(`/station/${evaId}`)).data;

  const xml = xmljs.parseXml(rawXml);

  const xmlStation = xml.get<Element>('//station');

  if (!xmlStation) {
    throw {
      status: 404,
      error: {
        type: '404',
        description: 'Unbekannte Station',
      },
    };
  }
  const station = parseStation(xmlStation);

  cache.set(evaId, station);

  return station;
}

export async function getStation(
  evaId: string,
  recursive: number = 0,
  axios?: AxiosInstance
): Promise<IrisStationWithRelated> {
  const station = await getSingleStation(evaId, axios);
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
          const station = await getSingleStation(id, axios);

          relatedStations.push(station);

          return station.meta;
        })
      )
    ).flat();
  }

  return {
    station,
    relatedStations: relatedStations.sort((s1, s2) =>
      s1.name > s2.name ? 1 : -1
    ),
  };
}
