import { risStationsConfiguration } from '@/external/config';
import {
  StopPlaceKeyFilter,
  StopPlacesApi,
  StopPlaceSearchGroupByKey,
} from '@/external/generated/risStations';
import { TransportType } from '@/external/types';
import { upstreamApiCountInterceptor } from '@/server/admin';
import axios from 'axios';
import type {
  ResolvedStopPlaceGroups,
  StopPlace,
  StopPlaceKey,
  StopPlaceSearchResult,
} from '@/external/types';

const nonÖPNVTypes = new Set<TransportType>([
  TransportType.HighSpeedTrain,
  TransportType.IntercityTrain,
  TransportType.InterRegionalTrain,
  TransportType.RegionalTrain,
  TransportType.CityTrain,
]);

const axiosWithTimeout = axios.create({
  timeout: 15000,
});

axiosWithTimeout.interceptors.request.use(
  upstreamApiCountInterceptor.bind(undefined, 'ris-stations'),
);

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
  } catch (e) {
    if (axios.isAxiosError(e) && e.response?.status) {
      throw e;
    }
    return undefined;
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
