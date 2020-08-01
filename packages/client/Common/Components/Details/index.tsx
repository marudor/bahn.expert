import { DetailsContext } from './DetailsContext';
import { format } from 'date-fns';
import { getDetails } from 'client/Common/service/details';
import { Header } from './Header';
import { HeaderTagContainer } from 'client/Common/container/HeaderTagContainer';
import { StopList } from './StopList';
import { useEffect, useState } from 'react';
import { useQuery } from 'client/Common/hooks/useQuery';
import type { ParsedSearchOnTripResponse } from 'types/HAFAS/SearchOnTrip';
import type { ResponseError } from 'umi-request';

interface Props {
  train: string;
  stationId?: string;
  initialDeparture?: string;
  currentStopId?: string;
  urlPrefix?: string;
}

export const Details = ({
  train,
  initialDeparture,
  stationId,
  currentStopId,
  urlPrefix,
}: Props) => {
  const query = useQuery();
  const [details, setDetails] = useState<ParsedSearchOnTripResponse>();
  const [error, setError] = useState<ResponseError>();
  const { updateTitle, updateDescription } = HeaderTagContainer.useContainer();

  useEffect(() => {
    if (details) {
      updateTitle(
        `${details.train.name} @ ${format(
          details.departure.time,
          'dd.MM.yyyy'
        )}`
      );
    } else {
      updateTitle(train);
    }
    let description = `Details zu ${train}`;

    if (initialDeparture) {
      description += ` am ${format(
        Number.parseInt(initialDeparture, 10),
        'dd.MM.yyyy'
      )}`;
    }
    updateDescription(description);
  }, [details, initialDeparture, train, updateDescription, updateTitle]);

  useEffect(() => {
    setDetails(undefined);
    getDetails(
      train,
      initialDeparture,
      currentStopId,
      stationId,
      query.profile as any
    )
      .then((details) => {
        setDetails(details);
        setError(undefined);
      })
      .catch((e) => {
        setError(e);
      });
  }, [train, initialDeparture, currentStopId, query.profile, stationId]);

  return (
    <DetailsContext.Provider
      value={{
        details,
        error,
        urlPrefix,
      }}
    >
      <Header train={train} />
      <StopList />
    </DetailsContext.Provider>
  );
};
