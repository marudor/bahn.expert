// @flow
import { connect } from 'react-redux';
import React from 'react';
import TraewellingLink from './TraewellingLink';
import TravelynxLink from './TravelynxLink';
import withStyles, { type StyledProps } from 'react-jss';
import type { Abfahrt } from 'types/abfahrten';
import type { AbfahrtenState } from 'AppState';

type StateProps = {|
  +type: $ElementType<marudorConfig, 'checkIn'>,
|};

type OwnProps = {|
  +abfahrt: Abfahrt,
|};

type ReduxProps = {|
  ...StateProps,
  ...OwnProps,
  +dispatch: Function,
|};

type Props = StyledProps<ReduxProps, typeof styles>;
const CheckInLink = ({ type, abfahrt, classes }: Props) => {
  switch (type) {
    case 'traewelling':
      return <TraewellingLink abfahrt={abfahrt} className={classes.link} />;
    case 'travelynx':
      return <TravelynxLink abfahrt={abfahrt} className={classes.link} />;
    default:
      return null;
  }
};

export const styles = {
  link: {
    fontSize: '0.6em',
  },
};

export function preventDefault(e: SyntheticMouseEvent<>) {
  e.stopPropagation();

  return false;
}

export default connect<ReduxProps, OwnProps, StateProps, _, AbfahrtenState, _>(state => ({
  type: state.config.config.checkIn,
}))(withStyles(styles)(CheckInLink));
