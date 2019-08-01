import { Abfahrt } from 'types/abfahrten';
import { CheckInType } from 'Common/config';
import React from 'react';
import TraewellingLink from './TraewellingLink';
import TravelynxLink from './TravelynxLink';

type Props = {
  abfahrt: Abfahrt;
  type: CheckInType;
};

const CheckInLink = ({ abfahrt, type }: Props) => {
  switch (type) {
    case CheckInType.Traewelling:
      return <TraewellingLink abfahrt={abfahrt} />;
    case CheckInType.Travelynx:
      return <TravelynxLink abfahrt={abfahrt} />;
    case CheckInType.Both:
      return (
        <>
          <TraewellingLink abfahrt={abfahrt} />
          <TravelynxLink abfahrt={abfahrt} />
        </>
      );
    default:
      return null;
  }
};

export default CheckInLink;
