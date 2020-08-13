import { orderBy } from 'client/util';
import fs from 'fs';
import Fuse from 'fuse.js';
import path from 'path';
import type { Station } from 'types/station';

const dataPath = path.resolve(__dirname, 'data/Stationsdaten.csv');
// eslint-disable-next-line no-sync
const csv = fs.readFileSync(dataPath, 'utf8');

const entries: string[][] = csv.split('\n').map((l) => l.split(';'));

interface StationsData {
  id: string;
  DS100: string;
  ifopt: string;
  name: string;
  verkehr: 'FV' | 'NV' | 'DPN';
  lng: string;
  lat: string;
}

// Remve HeaderLine
entries.shift();
const stationData: StationsData[] = entries
  .filter((e) => e[3])
  .map((e) => {
    const [id, DS100, ifopt, name, verkehr, lng, lat] = e;

    return {
      id,
      DS100,
      ifopt,
      name,
      titleLength: name.length,
      verkehr: verkehr as any,
      lng,
      lat,
    };
  });

const searchableStations = new Fuse(stationData, {
  includeScore: true,
  threshold: 0.19,
  minMatchCharLength: 2,
  location: 0,
  distance: 10,
  keys: ['name'],
});

export default function (searchTerm: string): Promise<Station[]> {
  const matches = searchableStations.search(searchTerm);

  return Promise.resolve(
    orderBy(matches, 'score')
      .slice(0, 8)
      .map(({ item, score }) => ({
        title: item.name,
        id: item.id,
        DS100: item.DS100,
        raw: global.PROD
          ? undefined
          : {
              score,
              item,
            },
      }))
  );
}
