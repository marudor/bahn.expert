import { Abfahrt } from 'types/iris';
import { CheckInType } from 'Common/config';
import CommonConfigContainer from 'Common/container/CommonConfigContainer';
import React from 'react';
import TravelynxLink from './TravelynxLink';

interface Props {
  abfahrt: Abfahrt;
}

const CheckInLink = ({ abfahrt }: Props) => {
  const checkInType = CommonConfigContainer.useContainer().config.checkIn;

  if (checkInType === CheckInType.Travelynx) {
    return <TravelynxLink abfahrt={abfahrt} />;
  }

  return null;
};

export default CheckInLink;
