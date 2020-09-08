import {
  AbfahrtenConfigProvider,
  useAbfahrtenConfig,
  useAbfahrtenFetchAPIUrl,
} from 'client/Abfahrten/provider/AbfahrtenConfigProvider';
import { getStationsFromAPI } from 'client/Common/service/stationSearch';
import { useCallback, useEffect, useState } from 'react';
import Axios from 'axios';
import constate from 'constate';
import type { Abfahrt, AbfahrtenResult, Wings } from 'types/iris';
import type { AxiosError } from 'axios';
import type { FC, ReactNode } from 'react';
import type { Station, StationSearchType } from 'types/station';

// eslint-disable-next-line @typescript-eslint/no-empty-function
let cancelGetAbfahrten = () => {};

export const fetchAbfahrten = async (
  urlWithStationId: string,
  lookahead: string,
  lookbehind: string,
): Promise<AbfahrtenResult> => {
  cancelGetAbfahrten();
  const r = await Axios.get<AbfahrtenResult>(urlWithStationId, {
    cancelToken: new Axios.CancelToken((c) => {
      cancelGetAbfahrten = c;
    }),
    params: {
      lookahead,
      lookbehind,
    },
  });

  return r.data;
};

interface Departures {
  lookahead: Abfahrt[];
  lookbehind: Abfahrt[];
  wings?: Wings;
}

export type AbfahrtenError =
  | AbfahrtenError$Redirect
  | AbfahrtenError$404
  | AbfahrtenError$Default;
type AbfahrtenError$Redirect = Error & {
  errorType: 'redirect';
  redirect: string;
  station?: void;
};

type AbfahrtenError$404 = Error & {
  errorType: '404';
  station?: void;
};
interface AbfahrtenError$Default extends AxiosError {
  errorType: void;
  station?: string;
}

const useAbfahrtenInner = ({
  stationApiFunction = getStationsFromAPI,
}: {
  stationApiFunction?: (
    searchType: StationSearchType,
    stationName: string,
  ) => Promise<Station[]>;
}) => {
  const [currentStation, setCurrentStation] = useState<Station>();
  const [departures, setDepartures] = useState<Departures>();
  const [error, setError] = useState<AbfahrtenError>();
  const { lookahead, lookbehind, searchType } = useAbfahrtenConfig();
  const fetchApiUrl = useAbfahrtenFetchAPIUrl();

  const updateCurrentStationByString = useCallback(
    async (stationName: string) => {
      try {
        setCurrentStation((oldStation) => {
          if (oldStation && oldStation.title !== stationName) {
            setDepartures(undefined);
          }

          return {
            title: stationName,
            id: '',
          };
        });
        const stations = await stationApiFunction(searchType, stationName);

        if (stations.length) {
          setCurrentStation(stations[0]);
        } else {
          throw {
            errorType: '404',
          };
        }
      } catch (e) {
        e.station = stationName;

        if (e.response && e.response.status === 404) {
          e.errorType = '404';
        }
        setError(e);
      }
    },
    [searchType, stationApiFunction],
  );

  useEffect(() => {
    if (!currentStation || !currentStation.id) {
      setDepartures(undefined);

      return;
    }
    fetchAbfahrten(
      `${fetchApiUrl}/${currentStation.id}`,
      lookahead,
      lookbehind,
    ).then(
      (r) => {
        setDepartures({
          lookahead: r.departures,
          lookbehind: r.lookbehind,
          wings: r.wings,
        });
      },
      (e) => {
        e.station = currentStation.title;
        setError(e);
      },
    );
  }, [currentStation, fetchApiUrl, lookahead, lookbehind]);

  return {
    updateCurrentStationByString,
    currentStation,
    setCurrentStation,
    departures,
    setDepartures,
    error,
    setError,
  };
};

export const [
  InnerAbfahrtenProvider,
  useAbfahrtenDepartures,
  useAbfahrtenError,
  useCurrentAbfahrtenStation,
  useRawAbfahrten,
] = constate(
  useAbfahrtenInner,
  (v) => v.departures,
  (v) => v.error,
  (v) => v.currentStation,
  ({ departures, error, currentStation, ...r }) => r,
);

interface Props {
  children: ReactNode;
  fetchApiUrl: string;
  stationApiFunction?: typeof getStationsFromAPI;
  urlPrefix: string;
}
export const AbfahrtenProvider: FC<Props> = ({
  children,
  fetchApiUrl,
  stationApiFunction,
  urlPrefix,
}) => (
  <AbfahrtenConfigProvider urlPrefix={urlPrefix} fetchApiUrl={fetchApiUrl}>
    <InnerAbfahrtenProvider stationApiFunction={stationApiFunction}>
      {children}
    </InnerAbfahrtenProvider>
  </AbfahrtenConfigProvider>
);
