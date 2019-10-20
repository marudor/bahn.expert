import { Abfahrt, AbfahrtenResponse, Wings } from 'types/api/iris';
import { createContainer } from 'unstated-next';
import { getStationsFromAPI } from 'Common/service/stationSearch';
import { Station } from 'types/station';
import AbfahrtenConfigContainer, {
  AbfahrtenConfigProvider,
} from 'Abfahrten/container/AbfahrtenConfigContainer';
import Axios, { AxiosError } from 'axios';
import React, { ReactNode, useCallback, useEffect, useState } from 'react';

let cancelGetAbfahrten = () => {};

export const fetchAbfahrten = async (
  stationId: string,
  lookahead: string,
  lookbehind: string
): Promise<AbfahrtenResponse> => {
  cancelGetAbfahrten();
  const r = await Axios.get<AbfahrtenResponse>(
    `/api/iris/current/abfahrten/${stationId}`,
    {
      cancelToken: new Axios.CancelToken(c => {
        cancelGetAbfahrten = c;
      }),
      params: {
        lookahead,
        lookbehind,
      },
    }
  );

  return r.data;
};

type Departures = {
  lookahead: Abfahrt[];
  lookbehind: Abfahrt[];
  wings?: Wings;
};

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

const useAbfahrten = () => {
  const [currentStation, setCurrentStation] = useState<Station>();
  const [departures, setDepartures] = useState<Departures>();
  const [error, setError] = useState<AbfahrtenError>();
  const {
    config: { lookahead, lookbehind, searchType },
  } = AbfahrtenConfigContainer.useContainer();

  const updateCurrentStationByString = useCallback(
    async (stationName: string) => {
      try {
        setCurrentStation(oldStation => {
          if (oldStation && oldStation.title !== stationName) {
            setDepartures(undefined);
          }

          return {
            title: stationName,
            id: '',
          };
        });
        const stations = await getStationsFromAPI(searchType, stationName);

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
    [searchType]
  );

  useEffect(() => {
    if (!currentStation || !currentStation.id) return;
    fetchAbfahrten(currentStation.id, lookahead, lookbehind).then(
      r => {
        setDepartures({
          lookahead: r.departures,
          lookbehind: r.lookbehind,
          wings: r.wings,
        });
      },
      e => {
        e.station = currentStation.title;
        setError(e);
      }
    );
  }, [currentStation, lookahead, lookbehind]);

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

type Props = {
  children: ReactNode;
};
export const AbfahrtenProvider = ({ children }: Props) => (
  <AbfahrtenConfigProvider>
    <AbfahrtenContainer.Provider>{children}</AbfahrtenContainer.Provider>
  </AbfahrtenConfigProvider>
);

export default AbfahrtenContainer;
