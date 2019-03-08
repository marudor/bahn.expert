// @flow
import './index.scss';
import { connect } from 'react-redux';
import React from 'react';
import TraewellingLink from './TraewellingLink';
import TravelynxLink from './TravelynxLink';
import type { Abfahrt } from 'types/abfahrten';
import type { AppState } from 'AppState';

type StateProps = {|
  +type: $ElementType<marudorConfig, 'checkIn'>,
|};

type OwnProps = {|
  +abfahrt: Abfahrt,
|};

type Props = {|
  ...StateProps,
  ...OwnProps,
  +dispatch: Function,
|};
const CheckInLink = ({ abfahrt, type }: Props) => {
  switch (type) {
    case 'traewelling':
      return <TraewellingLink abfahrt={abfahrt} />;
    case 'travelynx':
      return <TravelynxLink abfahrt={abfahrt} />;
    default:
      return null;
  }
};

export function preventDefault(e: SyntheticMouseEvent<>) {
  e.stopPropagation();

  return false;
}

export default connect<Props, OwnProps, StateProps, _, AppState, _>(state => ({
  type: state.config.config.checkIn,
}))(CheckInLink);
