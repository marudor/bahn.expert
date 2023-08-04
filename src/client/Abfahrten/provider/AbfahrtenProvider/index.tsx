import {
  AbfahrtenConfigProvider,
  useAbfahrtenFetchAPIUrl,
} from '@/client/Abfahrten/provider/AbfahrtenConfigProvider';
import { useAuslastung } from '@/client/Abfahrten/provider/AuslastungsProvider';
import { useCallback, useEffect, useState } from 'react';
import { useCommonConfig } from '@/client/Common/provider/CommonConfigProvider';
import Axios from 'axios';
import constate from 'constate';
import type { AbfahrtenResult } from '@/types/iris';
import type { AxiosError } from 'axios';
import type { FC, PropsWithChildren, ReactNode } from 'react';
import type { MinimalStopPlace } from '@/types/stopPlace';

// eslint-disable-next-line @typescript-eslint/no-empty-function
let cancelGetAbfahrten = () => {};

/**
 * Returns null for cancelled requests that should be ignored
 */
export const fetchAbfahrten = async (
  urlWithStationId: string,
  lookahead: string,
  lookbehind: string,
  startTime?: Date,
): Promise<AbfahrtenResult | null> => {
  cancelGetAbfahrten();
  try {
    return (
      await Axios.get<AbfahrtenResult>(urlWithStationId, {
        cancelToken: new Axios.CancelToken((c) => {
          cancelGetAbfahrten = c;
        }),
        params: {
          lookahead,
          lookbehind,
          startTime,
        },
      })
    ).data;
  } catch (e) {
    if (Axios.isCancel(e)) {
      return null;
    }
    throw e;
  }
};

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
  searchFunction,
}: PropsWithChildren<{
  searchFunction: (searchTerm: string) => Promise<MinimalStopPlace[]>;
}>) => {
  const [currentStopPlace, setCurrentStopPlace] = useState<MinimalStopPlace>();
  const [departures, setDepartures] = useState<AbfahrtenResult>();
  const [error, setError] = useState<AbfahrtenError>();
  const fetchApiUrl = useAbfahrtenFetchAPIUrl();
  const { fetchVRRAuslastungForEva } = useAuslastung();
  const { startTime, lookahead, lookbehind } = useCommonConfig();

  useEffect(() => {
    if (departures?.stopPlaces) {
      for (const eva of departures.stopPlaces) {
        void fetchVRRAuslastungForEva(eva);
      }
    }
  }, [fetchVRRAuslastungForEva, departures]);

  const updateCurrentStopPlaceByString = useCallback(
    async (stopPlaceName: string) => {
      try {
        setCurrentStopPlace((oldStopPlace) => {
          if (oldStopPlace && oldStopPlace.name !== stopPlaceName) {
            setDepartures(undefined);
          }

          return {
            name: stopPlaceName,
            evaNumber: '',
            availableTransports: [],
          };
        });
        const stopPlaces = await searchFunction(stopPlaceName);

        if (stopPlaces.length) {
          setCurrentStopPlace(stopPlaces[0]);
        } else {
          throw {
            errorType: '404',
          };
        }
      } catch (e: any) {
        e.station = stopPlaceName;

        if (e.response && e.response.status === 404) {
          e.errorType = '404';
        }
        setError(e);
      }
    },
    [searchFunction],
  );

  useEffect(() => {
    if (!currentStopPlace?.evaNumber) {
      setDepartures(undefined);

      return;
    }
    fetchAbfahrten(
      `${fetchApiUrl}/${currentStopPlace.evaNumber}`,
      lookahead,
      lookbehind,
      startTime,
    ).then(
      (deps) => {
        if (deps) {
          setDepartures(deps);
        }
      },
      (e) => {
        e.station = currentStopPlace.name;
        setError(e);
      },
    );
  }, [currentStopPlace, fetchApiUrl, lookahead, lookbehind, startTime]);

  return {
    updateCurrentStopPlaceByString,
    currentStopPlace,
    setCurrentStopPlace,
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
  useCurrentAbfahrtenStopPlace,
  useRawAbfahrten,
] = constate(
  useAbfahrtenInner,
  (v) => v.departures,
  (v) => v.error,
  (v) => v.currentStopPlace,
  ({ departures, error, currentStopPlace, ...r }) => r,
);

interface Props {
  children: ReactNode;
  fetchApiUrl: string;
  stopPlaceApiFunction: (searchTerm: string) => Promise<MinimalStopPlace[]>;
  urlPrefix: string;
}
export const AbfahrtenProvider: FC<Props> = ({
  children,
  fetchApiUrl,
  stopPlaceApiFunction,
  urlPrefix,
}) => (
  <AbfahrtenConfigProvider urlPrefix={urlPrefix} fetchApiUrl={fetchApiUrl}>
    <InnerAbfahrtenProvider searchFunction={stopPlaceApiFunction}>
      {children}
    </InnerAbfahrtenProvider>
  </AbfahrtenConfigProvider>
);
