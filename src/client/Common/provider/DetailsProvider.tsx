import {
  getAdditionalJourneyInformation,
  getDetails,
} from 'client/Common/service/details';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useCommonConfig } from 'client/Common/provider/CommonConfigProvider';
import constate from 'constate';
import type { AdditionalJourneyInformation } from 'types/HAFAS/JourneyDetails';
import type { AxiosError } from 'axios';
import type { HafasStation, ParsedPolyline } from 'types/HAFAS';
import type { ParsedSearchOnTripResponse } from 'types/HAFAS/SearchOnTrip';
import type { Route$Auslastung, Route$Stop } from 'types/routing';

interface Props {
  trainName: string;
  initialDepartureDateString?: string;
  evaNumberAlongRoute?: string;
  urlPrefix?: string;
  journeyId?: string;
}

const useInnerDetails = ({
  initialDepartureDateString,
  evaNumberAlongRoute,
  trainName,
  urlPrefix,
  journeyId,
}: Props) => {
  const { autoUpdate } = useCommonConfig();
  const [isMapDisplay, setIsMapDisplay] = useState(false);
  const [details, setDetails] = useState<ParsedSearchOnTripResponse>();
  const [additionalInformation, setAdditionalInformation] =
    useState<AdditionalJourneyInformation>();
  const [error, setError] = useState<AxiosError>();

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
        journeyId,
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
    [trainName, initialDepartureDate, evaNumberAlongRoute, journeyId],
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
      const detailsLoc = details.stops.find((s) => s.station.id === loc.id);
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
  };
};

export const [DetailsProvider, useDetails] = constate(useInnerDetails);
