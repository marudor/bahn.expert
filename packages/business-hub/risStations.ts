import {
  PlatformsApi,
  StopPlaceKeyFilter,
  StopPlacesApi,
} from 'business-hub/generated';
import { risStationsConfiguration } from 'business-hub/config';
import { TransportType } from 'business-hub/types';
import axios from 'axios';
import type {
  Platform,
  ResolvedStopPlaceGroups,
  StopPlace,
  StopPlaceKey,
  StopPlaceSearchResult,
} from 'business-hub/types';

const nonÖPNVTypes = [
  TransportType.HighSpeedTrain,
  TransportType.IntercityTrain,
  TransportType.InterRegionalTrain,
  TransportType.RegionalTrain,
  TransportType.CityTrain,
];

const axiosWithTimeout = axios.create({
  timeout: 4000,
});

const stopPlaceClient = new StopPlacesApi(
  risStationsConfiguration,
  undefined,
  axiosWithTimeout,
);
const platformsClient = new PlatformsApi(
  risStationsConfiguration,
  undefined,
  axiosWithTimeout,
);

function withoutÖPNV(stopPlace: StopPlaceSearchResult) {
  return stopPlace.availableTransports.some((t) => nonÖPNVTypes.includes(t));
}

export async function byName(
  searchTerm?: string,
  onlySPNV?: boolean,
): Promise<StopPlaceSearchResult[]> {
  if (!searchTerm) return [];
  const result = (
    await stopPlaceClient.byName({
      query: searchTerm,
    })
  ).data;
  if (onlySPNV) {
    return result.stopPlaces?.filter(withoutÖPNV) || [];
  }

  return result.stopPlaces || [];
}

export async function keys(evaNumber: string): Promise<StopPlaceKey[]> {
  return (
    await stopPlaceClient.keys({
      evaNumber,
    })
  ).data.keys;
}

export async function byRl100(rl100: string): Promise<StopPlace | undefined> {
  try {
    const result = await stopPlaceClient.byKey({
      keyType: StopPlaceKeyFilter.Rl100,
      key: rl100,
    });
    return result.data.stopPlaces?.[0];
  } catch {
    return undefined;
  }
}

export async function byEva(evaNumber: string): Promise<StopPlace | undefined> {
  try {
    const result = (
      await stopPlaceClient.byEvaNumber({
        evaNumber,
      })
    ).data;
    return result.stopPlaces?.[0];
  } catch {
    return undefined;
  }
}

export async function byPosition(
  latitude: number,
  longitude: number,
  radius: number,
): Promise<StopPlaceSearchResult[]> {
  try {
    const result = (
      await stopPlaceClient.byPosition({
        longitude,
        latitude,
        radius,
      })
    ).data;
    return result.stopPlaces || [];
  } catch {
    return [];
  }
}

export async function platforms(evaNumber: string): Promise<Platform[]> {
  try {
    const result = (
      await platformsClient.platforms({
        evaNumber,
        includeSubPlatforms: true,
        includeOperational: true,
        includeAccessibility: true,
      })
    ).data;
    return result.platforms || [];
  } catch {
    return [];
  }
}

export async function groups(
  evaNumber: string,
): Promise<ResolvedStopPlaceGroups> {
  const groups = (
    await stopPlaceClient.groups({
      evaNumber,
    })
  ).data.groups;

  return groups.reduce((agg, g) => {
    agg[g.type] = g.members;
    return agg;
  }, {} as ResolvedStopPlaceGroups);
}
