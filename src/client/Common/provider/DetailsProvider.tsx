import {
  getAdditionalJourneyInformation,
  getDetails,
} from 'client/Common/service/details';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useCommonConfig } from 'client/Common/provider/CommonConfigProvider';
import { useSearchParams } from 'react-router-dom';
import constate from 'constate';
import type { AdditionalJourneyInformation } from 'types/HAFAS/JourneyDetails';
import type { AxiosError } from 'axios';
import type { ParsedSearchOnTripResponse } from 'types/HAFAS/SearchOnTrip';
import type { Route$Auslastung } from 'types/routing';

interface Props {
  trainName: string;
  initialDepartureDateString?: string;
  evaNumberAlongRoute?: string;
  urlPrefix?: string;
}

const useInnerDetails = ({
  initialDepartureDateString,
  evaNumberAlongRoute,
  trainName,
  urlPrefix,
}: Props) => {
  const { autoUpdate } = useCommonConfig();

  const [details, setDetails] = useState<ParsedSearchOnTripResponse>();
  const [additionalInformation, setAdditionalInformation] =
    useState<AdditionalJourneyInformation>();
  const [error, setError] = useState<AxiosError>();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    // we got a ris id, lets append this
    if (details?.jid.includes('-')) {
      setSearchParams((old) => {
        old.set('journeyId', details.jid);
        return old;
      });
    }
  }, [details, setSearchParams]);

  const initialDepartureDate = useMemo(() => {
    if (!initialDepartureDateString) return undefined;
    const initialDepartureNumber = +initialDepartureDateString;
    return new Date(
      Number.isNaN(initialDepartureNumber)
        ? initialDepartureDateString
        : initialDepartureNumber,
    );
  }, [initialDepartureDateString]);

  const refreshDetails = useCallback(
    (isAutorefresh?: boolean) => {
      if (!isAutorefresh) {
        setDetails(undefined);
        setAdditionalInformation(undefined);
      }
      getDetails(
        trainName,
        initialDepartureDate,
        evaNumberAlongRoute,
        searchParams.get('journeyId'),
      )
        .then(async (details) => {
          setDetails(details);
          // its a RIS thing, lets get extra information
          if (details.jid.includes('-')) {
            try {
              setAdditionalInformation(
                await getAdditionalJourneyInformation(
                  trainName,
                  details.jid,
                  initialDepartureDate,
                  evaNumberAlongRoute,
                ),
              );
            } catch {
              // ignoring this
            }
          } else {
            const occupancy: Record<string, Route$Auslastung> = {};
            for (const s of details.stops) {
              if (s.auslastung) {
                occupancy[s.station.id] = s.auslastung;
              }
            }
            setAdditionalInformation({
              occupancy,
            });
          }
          setError(undefined);
        })
        .catch((e) => {
          if (!isAutorefresh) {
            setError(e);
          }
        });
    },
    [trainName, initialDepartureDate, evaNumberAlongRoute, searchParams],
  );

  useEffect(() => {
    refreshDetails();
    let intervalId: NodeJS.Timeout;
    const cleanup = () => clearInterval(intervalId);
    if (autoUpdate) {
      intervalId = setInterval(() => {
        refreshDetails(true);
      }, autoUpdate * 1000);
    } else {
      cleanup();
    }
    return cleanup;
  }, [autoUpdate, refreshDetails]);

  return {
    initialDepartureDate,
    trainName,
    details,
    additionalInformation,
    error,
    urlPrefix,
    refreshDetails,
  };
};

export const [DetailsProvider, useDetails] = constate(useInnerDetails);
