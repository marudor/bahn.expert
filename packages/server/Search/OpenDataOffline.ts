import { orderBy } from 'shared/util';
import Fuse from 'fuse.js';
import rawStations from 'db-stations/data.json';
import type { Station } from 'types/station';

const searchableStations = new Fuse(rawStations, {
  includeScore: true,
  threshold: 0.3,
  minMatchCharLength: 2,
  location: 0,
  distance: 100,
  keys: ['name', 'ril'],
});

export default function (searchTerm: string): Promise<Station[]> {
  const matches = searchableStations.search(searchTerm);

  const weightedMatches = matches.map((m) => ({
    item: m.item,
    score: (1 - (m.score || 0) * 2) * m.item.weight,
  }));

  return Promise.resolve(
    orderBy(weightedMatches, 'score', 'desc').map(({ item }) => ({
      title: item.name,
      id: item.id,
      DS100: item.ril100,
      raw: global.PROD ? undefined : item,
    }))
  );
}
