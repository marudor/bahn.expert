import { AxiosError } from 'axios';
import { Route$JourneySegment } from 'types/routing';
import { useLocation } from 'react-router';
import DetailsContext from './DetailsContext';
import getDetails from 'Common/service/details';
import Header from './Header';
import qs from 'qs';
import React, { useEffect, useState } from 'react';
import StopList from './StopList';

interface Props {
  train: string;
  initialDeparture?: string;
  currentStopId?: string;
}

const Details = ({ train, initialDeparture, currentStopId }: Props) => {
  const location = useLocation();
  const query = qs.parse(location.search, { ignoreQueryPrefix: true });
  const [details, setDetails] = useState<Route$JourneySegment>();
  const [error, setError] = useState<AxiosError>();

  useEffect(() => {
    setDetails(undefined);
    getDetails(train, initialDeparture, currentStopId, query.profile)
      .then(details => {
        setDetails(details);
        setError(undefined);
      })
      .catch(e => {
        setError(e);
      });
  }, [train, initialDeparture, currentStopId, query.profile]);

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
