import { RouteComponentProps } from 'react-router';
import Details from 'Common/Components/Details';
import React from 'react';

interface Props
  extends RouteComponentProps<{ train: string; initialDeparture: string }> {}

const DetailsRoute = ({
  match: {
    params: { train, initialDeparture },
  },
}: Props) => <Details train={train} initialDeparture={initialDeparture} />;

export default DetailsRoute;
