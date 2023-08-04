import { Cache, CacheDatabase } from '@/server/cache';
import { sbbAxios } from '@/server/sbb/sbbAxios';
import type { MinimalStopPlace } from '@/types/stopPlace';

const sbbStopPlaceCache = new Cache(CacheDatabase.SBBStopPlaces);

function getStopPlaceRequest(name: string) {
  return {
    operationName: 'GetPlaces',
    variables: { input: { type: 'NAME', value: name }, language: 'DE' },
    query:
      'query GetPlaces($input: PlaceInput, $language: LanguageEnum!) {\n  places(input: $input, language: $language) {\n    id\n    name\n    __typename\n  }\n}',
  };
}

function sanitizeName(name: string) {
  return name.replaceAll(' ', '');
}

export async function findSingleStopPlace(
  stopPlace: Omit<MinimalStopPlace, 'ril100'>,
): Promise<any> {
  const sanitizedName = sanitizeName(stopPlace.name);
  const cached = await sbbStopPlaceCache.get(sanitizedName);
  if (cached) {
    return cached;
  }

  const data = getStopPlaceRequest(sanitizedName);

  const result = (
    await sbbAxios.post('/', data, {
      headers: {
        'apollographql-client-name': 'sbb-webshop',
      },
    })
  ).data;

  const exactMatch = result.data?.places.find(
    (s: any) => sanitizeName(s.name) === sanitizedName,
  );

  if (exactMatch) {
    void sbbStopPlaceCache.set(sanitizedName, exactMatch);
  }

  return exactMatch;
}
