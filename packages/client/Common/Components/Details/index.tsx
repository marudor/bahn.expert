import { DetailsContext } from './DetailsContext';
import { format } from 'date-fns';
import { getDetails } from 'client/Common/service/details';
import { Header } from './Header';
import { StopList } from './StopList';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useCommonConfig } from 'client/Common/provider/CommonConfigProvider';
import { useHeaderTagsActions } from 'client/Common/provider/HeaderTagProvider';
import { useQuery } from 'client/Common/hooks/useQuery';
import type { AxiosError } from 'axios';
import type { FC } from 'react';
import type { ParsedSearchOnTripResponse } from 'types/HAFAS/SearchOnTrip';

interface Props {
  train: string;
  stationId?: string;
  initialDeparture?: string;
  currentStopId?: string;
  urlPrefix?: string;
}

export const Details: FC<Props> = ({
  train,
  initialDeparture,
  stationId,
  currentStopId,
  urlPrefix,
}) => {
  const query = useQuery();
  const [details, setDetails] = useState<ParsedSearchOnTripResponse>();
  const [error, setError] = useState<AxiosError>();
  const { updateTitle, updateDescription } = useHeaderTagsActions();
  const { autoUpdate } = useCommonConfig();

  const initialDepartureDate = useMemo(() => {
    if (!initialDeparture) return undefined;
    const initialDepartureNumber = +initialDeparture;
    return new Date(
      Number.isNaN(initialDepartureNumber)
        ? initialDeparture
        : initialDepartureNumber,
    );
  }, [initialDeparture]);

  useEffect(() => {
    if (details) {
      updateTitle(
        `${details.train.name} @ ${format(
          details.departure.time,
          'dd.MM.yyyy',
        )}`,
      );
    } else {
      updateTitle(train);
    }
    let description = `Details zu ${train}`;

    if (initialDepartureDate) {
      description += ` am ${format(initialDepartureDate, 'dd.MM.yyyy')}`;
    }
    updateDescription(description);
  }, [details, initialDepartureDate, train, updateDescription, updateTitle]);

  const refresh = useCallback(() => {
    setDetails(undefined);
    getDetails(
      train,
      initialDepartureDate,
      currentStopId,
      stationId,
      query.profile as any,
    )
      .then((details) => {
        setDetails(details);
        setError(undefined);
      })
      .catch((e) => {
        setError(e);
      });
  }, [train, initialDepartureDate, currentStopId, stationId, query.profile]);

  useEffect(() => {
    refresh();
    let intervalId: NodeJS.Timeout;
    const cleanup = () => clearInterval(intervalId);
    if (autoUpdate) {
      intervalId = setInterval(() => {
        getDetails(
          train,
          initialDepartureDate,
          currentStopId,
          stationId,
          query.profile as any,
        )
          .then(setDetails)
          .catch(() => {
            // we ignore auto update error
          });
      }, autoUpdate * 1000);
    } else {
      cleanup();
    }
    return cleanup;
  }, [train, initialDepartureDate, currentStopId, query.profile, stationId]);

  return (
    <DetailsContext.Provider
      value={{
        details,
        error,
        urlPrefix,
        refresh,
      }}
    >
      <Header train={train} />
      <StopList initialDepartureDate={initialDepartureDate} />
    </DetailsContext.Provider>
  );
};
