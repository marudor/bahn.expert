import { Abfahrt } from 'types/iris';
import { CheckInType } from 'Common/config';
import React from 'react';
import TravelynxLink from './TravelynxLink';

type Props = {
  abfahrt: Abfahrt;
  type: CheckInType;
};

const CheckInLink = ({ abfahrt, type }: Props) => {
  switch (type) {
    case CheckInType.Travelynx:
      return <TravelynxLink abfahrt={abfahrt} />;
    default:
      return null;
  }
};

export default CheckInLink;
