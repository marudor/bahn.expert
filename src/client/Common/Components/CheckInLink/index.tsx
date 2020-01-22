import { CheckInType } from 'Common/config';
import { CommonProductInfo, CommonStopInfo } from 'types/HAFAS';
import { Station } from 'types/station';
import CommonConfigContainer from 'Common/container/CommonConfigContainer';
import React from 'react';
import TravelynxLink from './TravelynxLink';

interface Props {
  departure?: CommonStopInfo;
  arrival?: CommonStopInfo;
  station: Station;
  train: CommonProductInfo;
  className?: string;
}

const CheckInLink = (props: Props) => {
  const checkInType = CommonConfigContainer.useContainer().config.checkIn;

  switch (checkInType) {
    case CheckInType.Travelynx:
      return <TravelynxLink {...props} />;
    default:
      return null;
  }
};

export default CheckInLink;
