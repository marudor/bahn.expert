import { Abfahrt } from 'types/abfahrten';
import { AbfahrtenState } from 'AppState';
import { CheckInType } from 'Common/config';
import { connect } from 'react-redux';
import React from 'react';
import TraewellingLink from './TraewellingLink';
import TravelynxLink from './TravelynxLink';

type StateProps = {
  type: CheckInType;
};

type OwnProps = {
  abfahrt: Abfahrt;
};

type Props = OwnProps & StateProps;

const CheckInLink = ({ type, abfahrt }: Props) => {
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

export default connect<StateProps, {}, OwnProps, AbfahrtenState>(state => ({
  type: state.abfahrtenConfig.config.checkIn,
}))(CheckInLink);
