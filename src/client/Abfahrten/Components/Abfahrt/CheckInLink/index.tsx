import { Abfahrt } from 'types/abfahrten';
import { AbfahrtenState } from 'AppState';
import { CheckInType } from 'Common/config';
import { connect } from 'react-redux';
import React from 'react';
import TraewellingLink from './TraewellingLink';
import TravelynxLink from './TravelynxLink';
import withStyles, { WithStyles } from 'react-jss';

type StateProps = {
  type: CheckInType;
};

type OwnProps = {
  abfahrt: Abfahrt;
};

type Props = OwnProps & StateProps & WithStyles<typeof styles>;

const CheckInLink = ({ type, abfahrt, classes }: Props) => {
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

export const styles = {
  link: {
    fontSize: '0.6em',
  },
};

export function preventDefault(e: React.SyntheticEvent) {
  e.stopPropagation();

  return false;
}

export default connect<StateProps, {}, OwnProps, AbfahrtenState>(state => ({
  type: state.config.config.checkIn,
}))(withStyles(styles)(CheckInLink));
