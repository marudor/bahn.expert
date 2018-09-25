// @flow
import { orderBy } from 'lodash';
import Fuse from 'fuse.js';
import rawStations from 'db-stations/data.json';
import type { Station } from 'types/abfahrten';

type OpenDataStation = {
  type: 'station',
  id: string,
  ds100: string,
  nr: number,
  name: string,
  weight: number,
  location: {
    type: 'location',
    latitude: number,
    longitude: number,
  },
  operator: {
    type: 'operator',
    id: string,
    name: string,
  },
  address: {
    city: string,
    zipcode: string,
    street: string,
  },
};

const searchableStations = new Fuse(rawStations, {
  includeScore: true,
  threshold: 0.3,
  tokenize: true,
  matchAllTokens: true,
  minMatchCharLength: 2,
  location: 0,
  distance: 100,
  maxPatternLength: 50,
  keys: ['name', 'ds100'],
});

export default function(searchTerm: string): Promise<Station[]> {
  const matches: {
    item: OpenDataStation,
    score: number,
  }[] = searchableStations.search(searchTerm);

  const weightedMatches = matches.map(m => ({
    item: m.item,
    score: (1 - m.score * 2) * m.item.weight,
  }));

  return Promise.resolve(
    orderBy(weightedMatches, 'score', ['desc']).map(({ item }) => ({
      title: item.name,
      id: item.id,
      ds100: item.ds100,
      favendoId: item.nr,
    }))
  );
}
