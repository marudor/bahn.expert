import { byEva, byName, byRl100, groups, keys } from '@/external/risStations';
import { Cache, CacheDatabase } from '@/server/cache';
import { getSingleStation } from '@/server/iris/station';
import { manualNameOverrides } from '@/server/StopPlace/manualNameOverrides';
import { searchWithHafas } from '@/server/StopPlace/hafasSearch';
import { StopPlaceKeyType } from '@/external/types';
import type { GroupedStopPlace, StopPlaceIdentifier } from '@/types/stopPlace';
import type {
  ResolvedStopPlaceGroups,
  StopPlace,
  StopPlaceSearchResult,
} from '@/external/types';

const stopPlaceStationSearchCache = new Cache<GroupedStopPlace[]>(
  CacheDatabase.StopPlaceSearch,
);
const stopPlaceSalesSearchCache = new Cache<GroupedStopPlace[]>(
  CacheDatabase.StopPlaceSalesSearch,
);
const stopPlaceIdentifierCache = new Cache<StopPlaceIdentifier | undefined>(
  CacheDatabase.StopPlaceIdentifier,
);
const stopPlaceByRilCache = new Cache<StopPlace>(CacheDatabase.StopPlaceByRil);
const stopPlaceByEvaCache = new Cache<GroupedStopPlace>(
  CacheDatabase.StopPlaceByEva,
);
const stopPlaceGroupCache = new Cache<ResolvedStopPlaceGroups>(
  CacheDatabase.StopPlaceGroups,
);

function mapToGroupedStopPlace(
  stopPlace: Pick<
    StopPlaceSearchResult,
    'evaNumber' | 'names' | 'availableTransports' | 'position'
  >,
): GroupedStopPlace {
  return {
    evaNumber: stopPlace.evaNumber,
    name: stopPlace.names.DE.nameLong,
    availableTransports: stopPlace.availableTransports,
    position: stopPlace.position,
  };
}

export async function irisFilter(
  stopPlaces: GroupedStopPlace[],
): Promise<GroupedStopPlace[]> {
  return (
    await Promise.all(
      stopPlaces.map(async (stopPlace) => {
        try {
          await getSingleStation(stopPlace.evaNumber);
          return stopPlace;
        } catch {
          return undefined;
        }
      }),
    )
  ).filter(Boolean);
}

export async function searchStopPlace(
  searchTerm?: string,
  max?: number,
  filterForIris?: boolean,
  groupBySales?: boolean,
): Promise<GroupedStopPlace[]> {
  try {
    const result = await searchStopPlaceRisStations(
      searchTerm,
      max,
      filterForIris,
      groupBySales,
    );
    if (result?.length || filterForIris || groupBySales) return result;
    return searchWithHafas(searchTerm, max, filterForIris);
  } catch {
    return searchWithHafas(searchTerm, max, filterForIris);
  }
}

export async function searchStopPlaceRisStations(
  searchTerm?: string,
  max?: number,
  filterForIris?: boolean,
  groupBySales?: boolean,
): Promise<GroupedStopPlace[]> {
  if (!searchTerm) return [];

  searchTerm = manualNameOverrides.get(searchTerm.toLowerCase()) || searchTerm;

  const searchCache = groupBySales
    ? stopPlaceSalesSearchCache
    : stopPlaceStationSearchCache;

  let groupedStopPlaces =
    (await searchCache.get(searchTerm)) ||
    (await searchStopPlaceRemote(searchTerm, groupBySales));

  if (filterForIris) {
    groupedStopPlaces = await irisFilter(groupedStopPlaces);
  }

  if (max) {
    return groupedStopPlaces.splice(0, max);
  }

  return groupedStopPlaces;
}

export async function getStopPlaceByEva(
  evaNumber: string,
  forceLive?: boolean,
): Promise<GroupedStopPlace | undefined> {
  if (!forceLive) {
    const cached = await stopPlaceByEvaCache.get(evaNumber);
    if (cached) return cached;
  }
  const risResult = await byEva(evaNumber);
  if (risResult) {
    const groupedStopPlace = mapToGroupedStopPlace(risResult);
    await addIdentifiers([groupedStopPlace]);
    if (!forceLive) {
      void stopPlaceByEvaCache.set(
        groupedStopPlace.evaNumber,
        groupedStopPlace,
      );
    }
    return groupedStopPlace;
  } else if (!forceLive) {
    const hafasResults = await searchWithHafas(evaNumber, 1, false);
    const groupedHafasResult = hafasResults[0];
    if (groupedHafasResult && groupedHafasResult.evaNumber === evaNumber) {
      void stopPlaceByEvaCache.set(
        groupedHafasResult.evaNumber,
        groupedHafasResult,
      );
      return groupedHafasResult;
    }
  }
}

async function byRl100WithSpaceHandling(
  rl100: string,
): Promise<StopPlace | undefined> {
  if (rl100.length > 5) {
    return undefined;
  }
  const cached = await stopPlaceByRilCache.get(rl100);
  if (cached) {
    return cached;
  }
  const rl100Promise = byRl100(rl100.toUpperCase());
  let rl100DoubleSpacePromise: typeof rl100Promise = Promise.resolve(undefined);
  if (rl100.length < 5 && rl100.includes(' ')) {
    rl100DoubleSpacePromise = byRl100(
      rl100.replaceAll(' ', '  ').toUpperCase(),
    );
  }
  const result = (await rl100Promise) || (await rl100DoubleSpacePromise);
  if (result) {
    void stopPlaceByRilCache.set(rl100, result);
  }
  return result;
}

export async function getStopPlaceByRl100(
  rl100: string,
): Promise<GroupedStopPlace | undefined> {
  const stopPlace = await byRl100WithSpaceHandling(rl100);
  if (!stopPlace) {
    return;
  }
  const grouped = mapToGroupedStopPlace(stopPlace);
  await addIdentifiers([grouped]);
  return grouped;
}

async function searchStopPlaceRemote(
  searchTerm: string,
  groupBySales?: boolean,
) {
  const [risResult, rl100Result] = await Promise.all([
    byName(searchTerm, undefined, groupBySales),
    byRl100WithSpaceHandling(searchTerm.toUpperCase()),
  ]);
  const groupedStopPlaces = risResult.map(mapToGroupedStopPlace);
  if (rl100Result) {
    groupedStopPlaces.unshift(mapToGroupedStopPlace(rl100Result));
    if (groupedStopPlaces[1]?.name.toLowerCase() === searchTerm.toLowerCase()) {
      const [rl100, directMatch] = groupedStopPlaces;
      groupedStopPlaces[0] = directMatch;
      groupedStopPlaces[1] = rl100;
    }
  }
  await addIdentifiers(groupedStopPlaces);

  const searchCache = groupBySales
    ? stopPlaceSalesSearchCache
    : stopPlaceStationSearchCache;

  void searchCache.set(searchTerm, groupedStopPlaces);
  for (const s of groupedStopPlaces) {
    void stopPlaceByEvaCache.set(s.evaNumber, s);
  }
  return groupedStopPlaces;
}

async function addIdentifiers(stopPlaces: GroupedStopPlace[]): Promise<void> {
  await Promise.all(
    stopPlaces.map(async (stopPlace) => {
      const identifier = await getIdentifiers(stopPlace.evaNumber);
      if (identifier) {
        stopPlace.alternativeRil100 = identifier.alternativeRil100;
        stopPlace.ifopt = identifier.ifopt;
        stopPlace.ril100 = identifier.ril100;
        stopPlace.stationId = identifier.stationId;
        stopPlace.uic = identifier.uic;
      }
    }),
  );
}

export async function getIdentifiers(
  evaNumber: string,
  cacheOnly?: boolean,
): Promise<StopPlaceIdentifier | undefined> {
  const cached = await stopPlaceIdentifierCache.get(evaNumber);
  if (cached) return Object.values(cached).length > 0 ? cached : undefined;
  if (cacheOnly) return undefined;
  const identifier: StopPlaceIdentifier = {
    evaNumber,
  };
  try {
    const stopPlaceKeys = await keys(evaNumber);
    for (const { type, key } of stopPlaceKeys) {
      switch (type) {
        case StopPlaceKeyType.Ifopt: {
          identifier.ifopt = key;
          break;
        }
        case StopPlaceKeyType.Rl100: {
          identifier.ril100 = key;
          break;
        }
        case StopPlaceKeyType.Rl100Alternative: {
          if (!identifier.alternativeRil100) {
            identifier.alternativeRil100 = [];
          }
          identifier.alternativeRil100.push(key);
          break;
        }
        case StopPlaceKeyType.Stada: {
          identifier.stationId = key;
          break;
        }
        case StopPlaceKeyType.Uic: {
          identifier.uic = key;
          break;
        }
      }
    }
    void stopPlaceIdentifierCache.set(evaNumber, identifier);
    if (Object.keys(identifier).length > 0) {
      return identifier;
    }
  } catch {
    // Failed, guess no identifier
  }

  return undefined;
}

export async function getGroups(
  evaNumber: string,
): Promise<ResolvedStopPlaceGroups> {
  const cached = await stopPlaceGroupCache.get(evaNumber);
  if (cached) {
    return cached;
  }
  return groups(evaNumber);
}
