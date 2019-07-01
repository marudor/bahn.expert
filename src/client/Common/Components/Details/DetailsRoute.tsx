import { RouteComponentProps } from 'react-router';
import Details from 'Common/Components/Details';
import qs from 'qs';
import React from 'react';

interface Props
  extends RouteComponentProps<{ train: string; initialDeparture: string }> {}

const DetailsRoute = ({
  match: {
    params: { train, initialDeparture },
  },
  location,
}: Props) => (
  <Details
    train={train}
    initialDeparture={initialDeparture}
    currentStopId={qs.parse(location.search.substr(1)).stop}
  />
);

export default DetailsRoute;
