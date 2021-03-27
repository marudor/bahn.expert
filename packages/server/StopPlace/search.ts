import { byName, byPosition, byRl100, keys } from 'business-hub';
import { CacheDatabases, createNewCache } from 'server/cache';
import { getSingleStation } from 'server/iris/station';
import { StopPlaceKeyType } from 'business-hub/types/RisStations';
import type {
  Coordinate2D,
  StopPlaceSearchResult,
  TransportType,
} from 'business-hub/types/RisStations';

const stopPlaceSearchCache = createNewCache<string, GroupedStopPlace[]>(
  3 * 24 * 60 * 60,
  CacheDatabases.StopPlaceSearch,
);
const stopPlaceGeoCache = createNewCache<string, GroupedStopPlace[]>(
  3 * 24 * 60 * 60,
  CacheDatabases.StopPlaceGeo,
);
const stopPlaceIdentifierCache = createNewCache<
  string,
  StopPlaceIdentifier | undefined
>(3 * 24 * 60 * 60, CacheDatabases.StopPlaceIdentifier);

export interface StopPlaceIdentifier {
  stationId?: string;
  /** also known as DHID, globalId */
  ifopt?: string;
  ril100?: string;
  alternativeRil100?: string[];
}

export interface GroupedStopPlace {
  evaNumber: string;
  name: string;
  availableTransports: TransportType[];
  position?: Coordinate2D;
  identifier?: StopPlaceIdentifier;
}

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

type B<X> = (x: X | undefined) => x is X;

async function irisFilter(
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
  ).filter((Boolean as unknown) as B<GroupedStopPlace>);
}

export async function searchStopPlace(
  searchTerm?: string,
  max?: number,
  filterForIris?: boolean,
): Promise<GroupedStopPlace[]> {
  if (!searchTerm) return [];
  let groupedStopPlaces =
    (await stopPlaceSearchCache.get(searchTerm)) ||
    (await searchStopPlaceRemote(searchTerm));

  if (max) {
    groupedStopPlaces = groupedStopPlaces.splice(0, max);
  }

  if (filterForIris) {
    groupedStopPlaces = await irisFilter(groupedStopPlaces);
  }

  return groupedStopPlaces;
}

export async function geoSearchStopPlace(
  lat: number,
  lng: number,
  radius: number,
  filterForIris?: boolean,
): Promise<GroupedStopPlace[]> {
  const cacheKey = `${lat}_${lng}_${radius}`;
  const cached = await stopPlaceGeoCache.get(cacheKey);
  if (cached) return cached;

  let groupedStopPlaces = (await byPosition(lat, lng, radius)).map(
    mapToGroupedStopPlace,
  );
  await addIdentifiers(groupedStopPlaces);
  void stopPlaceGeoCache.set(cacheKey, groupedStopPlaces);

  if (filterForIris) {
    groupedStopPlaces = await irisFilter(groupedStopPlaces);
  }

  return groupedStopPlaces;
}

async function searchStopPlaceRemote(searchTerm: string) {
  const rl100Promise = byRl100(searchTerm.toUpperCase());
  const risResultPromise = byName(searchTerm);
  const risResult = await risResultPromise;
  const rl100Result = await rl100Promise;
  const groupedStopPlaces = risResult.map(mapToGroupedStopPlace);
  if (rl100Result) {
    groupedStopPlaces.unshift(mapToGroupedStopPlace(rl100Result));
  }
  await addIdentifiers(groupedStopPlaces);

  void stopPlaceSearchCache.set(searchTerm, groupedStopPlaces);
  return groupedStopPlaces;
}

async function addIdentifiers(stopPlaces: GroupedStopPlace[]): Promise<void> {
  await Promise.all(
    stopPlaces.map(async (stopPlace) => {
      stopPlace.identifier = await getIdentifiers(stopPlace.evaNumber);
    }),
  );
}

export async function getIdentifiers(
  evaNumber: string,
): Promise<StopPlaceIdentifier | undefined> {
  const cached = await stopPlaceIdentifierCache.get(evaNumber);
  if (cached) return Object.values(cached).length > 0 ? cached : undefined;
  const identifier: StopPlaceIdentifier = {};
  try {
    const stopPlaceKeys = await keys(evaNumber);
    stopPlaceKeys.forEach(({ type, key }) => {
      switch (type) {
        case StopPlaceKeyType.IFOPT:
          identifier.ifopt = key;
          break;
        case StopPlaceKeyType.RL100:
          identifier.ril100 = key;
          break;
        case StopPlaceKeyType.RL100ALTERNATIVE:
          if (!identifier.alternativeRil100) {
            identifier.alternativeRil100 = [];
          }
          identifier.alternativeRil100.push(key);
          break;
        case StopPlaceKeyType.STADA:
          identifier.stationId = key;
          break;
      }
    });
    void stopPlaceIdentifierCache.set(evaNumber, identifier);
    if (Object.keys(identifier).length > 0) {
      return identifier;
    }
  } catch {
    // Failed, guess no identifier
  }

  return undefined;
}
