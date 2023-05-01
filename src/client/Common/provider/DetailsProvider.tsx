import { addDays } from 'date-fns';
import {
  getAdditionalJourneyInformation,
  getDetails,
} from '@/client/Common/service/details';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useCommonConfig } from '@/client/Common/provider/CommonConfigProvider';
import { useNavigate } from 'react-router';
import constate from 'constate';
import type { AdditionalJourneyInformation } from '@/types/HAFAS/JourneyDetails';
import type { AxiosError } from 'axios';
import type { HafasStation, ParsedPolyline } from '@/types/HAFAS';
import type { ParsedSearchOnTripResponse } from '@/types/HAFAS/SearchOnTrip';
import type { Route$Auslastung, Route$Stop } from '@/types/routing';

interface Props {
  trainName: string;
  initialDepartureDateString?: string;
  evaNumberAlongRoute?: string;
  urlPrefix?: string;
  journeyId?: string;
  // HAFAS
  jid?: string;
  administration?: string;
}

const useInnerDetails = ({
  initialDepartureDateString,
  evaNumberAlongRoute,
  trainName,
  urlPrefix,
  journeyId,
  jid,
  administration,
}: Props) => {
  const { autoUpdate } = useCommonConfig();
  const [isMapDisplay, setIsMapDisplay] = useState(false);
  const [details, setDetails] = useState<ParsedSearchOnTripResponse>();
  const [additionalInformation, setAdditionalInformation] =
    useState<AdditionalJourneyInformation>();
  const [error, setError] = useState<AxiosError>();
  const navigate = useNavigate();

  const initialDepartureDate = useMemo(() => {
    if (!initialDepartureDateString) return new Date();
    const initialDepartureNumber = +initialDepartureDateString;
    return new Date(
      Number.isNaN(initialDepartureNumber)
        ? initialDepartureDateString
        : initialDepartureNumber,
    );
  }, [initialDepartureDateString]);

  const sameTrainDaysInFuture = useCallback(
    (daysForward: number) => {
      const oldDate = details?.departure.scheduledTime || initialDepartureDate;
      const newDate = addDays(oldDate, daysForward);
      const newAdministration = administration || details?.train.admin;
      navigate(
        `${
          urlPrefix || '/'
        }details/${trainName}/${newDate.toISOString()}?administration=${newAdministration}`,
      );
      setDetails(undefined);
      setAdditionalInformation(undefined);
      setError(undefined);
    },
    [
      initialDepartureDate,
      details,
      administration,
      navigate,
      urlPrefix,
      trainName,
    ],
  );

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
        journeyId,
        administration,
        jid,
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
                occupancy[s.station.evaNumber] = s.auslastung;
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
    [
      trainName,
      initialDepartureDate,
      evaNumberAlongRoute,
      journeyId,
      administration,
      jid,
    ],
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

  const toggleMapDisplay = useCallback(
    () => setIsMapDisplay((old) => !old),
    [],
  );

  const matchedPolyline:
    | (Omit<ParsedPolyline, 'locations'> & {
        locations: (HafasStation & {
          details?: Route$Stop;
        })[];
      })
    | undefined = useMemo(() => {
    const polyline = additionalInformation?.polyline || details?.polyline;
    if (!polyline) return undefined;
    if (!details) return undefined;

    for (const loc of polyline.locations) {
      const detailsLoc = details.stops.find(
        (s) => s.station.evaNumber === loc.evaNumber,
      );
      if (detailsLoc) {
        // @ts-expect-error adding information
        loc.details = detailsLoc;
      }
    }

    return polyline;
  }, [details, additionalInformation]);

  return {
    initialDepartureDate,
    trainName,
    details,
    additionalInformation,
    error,
    urlPrefix,
    refreshDetails,
    polyline: matchedPolyline,
    isMapDisplay,
    toggleMapDisplay,
    sameTrainDaysInFuture,
  };
};

export const [DetailsProvider, useDetails] = constate(useInnerDetails);
