import { Abfahrt } from 'types/abfahrten';
import { AbfahrtenState } from 'AppState';
import { CheckInType } from 'Common/config';
import { connect } from 'react-redux';
import React from 'react';
import TraewellingLink from './TraewellingLink';
import TravelynxLink from './TravelynxLink';
import useStyles from './index.style';

type StateProps = {
  type: CheckInType;
};

type OwnProps = {
  abfahrt: Abfahrt;
};

type Props = OwnProps & StateProps;

const CheckInLink = ({ type, abfahrt }: Props) => {
  const classes = useStyles();

  switch (type) {
    case CheckInType.Traewelling:
      return <TraewellingLink abfahrt={abfahrt} className={classes.link} />;
    case CheckInType.Travelynx:
      return <TravelynxLink abfahrt={abfahrt} className={classes.link} />;
    case CheckInType.Both:
      return (
        <>
          <TraewellingLink abfahrt={abfahrt} className={classes.link} />
          <TravelynxLink abfahrt={abfahrt} className={classes.link} />
        </>
      );
    default:
      return null;
  }
};

export default connect<StateProps, {}, OwnProps, AbfahrtenState>(state => ({
  type: state.abfahrtenConfig.config.checkIn,
}))(CheckInLink);
