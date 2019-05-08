import { Abfahrt } from 'types/abfahrten';
import { AbfahrtenState } from 'AppState';
import { CheckInType } from 'Common/config';
import { connect } from 'react-redux';
import { createStyles, withStyles, WithStyles } from '@material-ui/styles';
import React from 'react';
import TraewellingLink from './TraewellingLink';
import TravelynxLink from './TravelynxLink';

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

export const styles = createStyles(theme => ({
  link: {
    fontSize: '0.6em',
    color: 'blue',
  },
}));

export default connect<StateProps, {}, OwnProps, AbfahrtenState>(state => ({
  type: state.abfahrtenConfig.config.checkIn,
}))(withStyles(styles)(CheckInLink));
