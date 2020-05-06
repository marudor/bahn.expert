import { CheckInType } from 'Common/config';
import CommonConfigContainer from 'Common/container/CommonConfigContainer';
import TravelynxLink from './TravelynxLink';
import type { CommonProductInfo, CommonStopInfo } from 'types/HAFAS';
import type { Station } from 'types/station';

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
