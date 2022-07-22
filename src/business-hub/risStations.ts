import { risStationsConfiguration } from 'business-hub/config';
import {
  StopPlaceKeyFilter,
  StopPlacesApi,
  StopPlaceSearchGroupByKey,
} from 'business-hub/generated';
import { TransportType } from 'business-hub/types';
import axios from 'axios';
import type {
  ResolvedStopPlaceGroups,
  StopPlace,
  StopPlaceKey,
  StopPlaceSearchResult,
} from 'business-hub/types';

const nonÖPNVTypes = new Set([
  TransportType.HighSpeedTrain,
  TransportType.IntercityTrain,
  TransportType.InterRegionalTrain,
  TransportType.RegionalTrain,
  TransportType.CityTrain,
]);

const axiosWithTimeout = axios.create({
  timeout: 4500,
});

const stopPlaceClient = new StopPlacesApi(
  risStationsConfiguration,
  undefined,
  axiosWithTimeout,
);

function withoutÖPNV(stopPlace: StopPlaceSearchResult) {
  return stopPlace.availableTransports.some((t) => nonÖPNVTypes.has(t));
}

export async function byName(
  searchTerm?: string,
  onlySPNV?: boolean,
  groupBySales?: boolean,
): Promise<StopPlaceSearchResult[]> {
  if (!searchTerm) return [];
  const result = (
    await stopPlaceClient.getStopPlacesByName({
      query: searchTerm,
      groupBy: groupBySales
        ? StopPlaceSearchGroupByKey.Sales
        : StopPlaceSearchGroupByKey.Station,
    })
  ).data;
  if (onlySPNV) {
    return result.stopPlaces?.filter(withoutÖPNV) || [];
  }

  return result.stopPlaces || [];
}

export async function keys(evaNumber: string): Promise<StopPlaceKey[]> {
  return (
    await stopPlaceClient.getStopPlaceKeys({
      evaNumber,
    })
  ).data.keys;
}

export async function byRl100(rl100: string): Promise<StopPlace | undefined> {
  try {
    const result = await stopPlaceClient.getStopPlacesByKey({
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
      await stopPlaceClient.getStopPlacesByEvaNumber({
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
  groupBySales?: boolean,
): Promise<StopPlaceSearchResult[]> {
  try {
    const result = (
      await stopPlaceClient.getStopPlacesByPosition({
        longitude,
        latitude,
        radius,
        groupBy: groupBySales
          ? StopPlaceSearchGroupByKey.Sales
          : StopPlaceSearchGroupByKey.Station,
      })
    ).data;
    return result.stopPlaces || [];
  } catch {
    return [];
  }
}

export async function groups(
  evaNumber: string,
): Promise<ResolvedStopPlaceGroups> {
  const groups = (
    await stopPlaceClient.getStopPlaceGroups({
      evaNumber,
    })
  ).data.groups;

  const resolvedStopPlaceGroups: ResolvedStopPlaceGroups = {};

  for (const group of groups) {
    resolvedStopPlaceGroups[group.type] = group.members;
  }

  return resolvedStopPlaceGroups;
}
