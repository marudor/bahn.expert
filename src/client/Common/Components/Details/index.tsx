import { Route$JourneySegment } from 'types/routing';
import DetailsContext from './DetailsContext';
import getDetails from 'Common/service/details';
import Header from './Header';
import React, { useEffect, useState } from 'react';
import StopList from './StopList';

interface Props {
  train: string;
  initialDeparture: string;
  currentStopId?: string;
}

const Details = ({ train, initialDeparture, currentStopId }: Props) => {
  const [details, setDetails] = useState<Route$JourneySegment>();

  useEffect(() => {
    getDetails(train, initialDeparture, currentStopId).then(details => {
      setDetails(details);
    });
  }, [train, initialDeparture, currentStopId]);

  return (
    <DetailsContext.Provider value={details}>
      <Header train={train} />
      <StopList />
    </DetailsContext.Provider>
  );
};

export default Details;
