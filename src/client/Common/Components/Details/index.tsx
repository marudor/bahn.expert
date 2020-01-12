import { AxiosError } from 'axios';
import { format } from 'date-fns';
import { ParsedSearchOnTripResponse } from 'types/HAFAS/SearchOnTrip';
import DetailsContext from './DetailsContext';
import getDetails from 'Common/service/details';
import Header from './Header';
import HeaderTagContainer from 'Common/container/HeaderTagContainer';
import React, { useEffect, useState } from 'react';
import StopList from './StopList';
import useQuery from 'Common/hooks/useQuery';

interface Props {
  train: string;
  stationId?: string;
  initialDeparture?: string;
  currentStopId?: string;
}

const Details = ({
  train,
  initialDeparture,
  stationId,
  currentStopId,
}: Props) => {
  const query = useQuery();
  const [details, setDetails] = useState<ParsedSearchOnTripResponse>();
  const [error, setError] = useState<AxiosError>();
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
    getDetails(train, initialDeparture, currentStopId, stationId, query.profile)
      .then(details => {
        setDetails(details);
        setError(undefined);
      })
      .catch(e => {
        setError(e);
      });
  }, [train, initialDeparture, currentStopId, query.profile, stationId]);

  return (
    <DetailsContext.Provider
      value={{
        details,
        error,
      }}
    >
      <Header train={train} />
      <StopList />
    </DetailsContext.Provider>
  );
};

export default Details;
