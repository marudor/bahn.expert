import { createContainer } from 'unstated-next';
import { getStationsFromAPI } from 'shared/service/stationSearch';
import { ReactNode, useCallback, useEffect, useState } from 'react';
import AbfahrtenConfigContainer, {
  AbfahrtenConfigProvider,
} from 'Abfahrten/container/AbfahrtenConfigContainer';
import Axios, { AxiosError } from 'axios';
import type { Abfahrt, AbfahrtenResult, Wings } from 'types/iris';
import type { Station, StationSearchType } from 'types/station';

let cancelGetAbfahrten = () => {};

export const fetchAbfahrten = async (
  urlWithStationId: string,
  lookahead: string,
  lookbehind: string
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
  type: 'redirect';
  redirect: string;
  station?: void;
};

type AbfahrtenError$404 = Error & {
  type: '404';
  station?: void;
};
type AbfahrtenError$Default = AxiosError & {
  type: void;
  station?: string;
};

const useAbfahrten = (
  stationApiFunction: (
    searchType: StationSearchType,
    stationName: string
  ) => Promise<Station[]> = getStationsFromAPI
) => {
  const [currentStation, setCurrentStation] = useState<Station>();
  const [departures, setDepartures] = useState<Departures>();
  const [error, setError] = useState<AbfahrtenError>();
  const {
    config: { lookahead, lookbehind, searchType },
    fetchApiUrl,
  } = AbfahrtenConfigContainer.useContainer();

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
            type: '404',
          };
        }
      } catch (e) {
        e.station = stationName;

        if (e.response && e.response.status === 404) {
          e.type = '404';
        }
        setError(e);
      }
    },
    [searchType, stationApiFunction]
  );

  useEffect(() => {
    if (!currentStation || !currentStation.id) {
      setDepartures(undefined);

      return;
    }
    fetchAbfahrten(
      `${fetchApiUrl}/${currentStation.id}`,
      lookahead,
      lookbehind
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
      }
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

const AbfahrtenContainer = createContainer(useAbfahrten);

interface Props {
  children: ReactNode;
  fetchApiUrl: string;
  stationApiFunction?: typeof getStationsFromAPI;
  urlPrefix: string;
}
export const AbfahrtenProvider = ({
  children,
  fetchApiUrl,
  stationApiFunction,
  urlPrefix,
}: Props) => (
  <AbfahrtenConfigProvider urlPrefix={urlPrefix} fetchApiUrl={fetchApiUrl}>
    <AbfahrtenContainer.Provider initialState={stationApiFunction}>
      {children}
    </AbfahrtenContainer.Provider>
  </AbfahrtenConfigProvider>
);

export default AbfahrtenContainer;
