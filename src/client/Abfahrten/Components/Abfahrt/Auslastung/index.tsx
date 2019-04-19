import { Abfahrt } from 'types/abfahrten';
import { AbfahrtenState } from 'AppState';
import { connect } from 'react-redux';
import Auslastungsradar from './Auslastungsradar';
import React from 'react';

type StateProps = {
  auslastungsRadar: boolean;
};
type OwnProps = {
  abfahrt: Abfahrt;
};

type Props = StateProps & OwnProps;

const Auslastung = ({ auslastungsRadar, abfahrt }: Props) =>
  auslastungsRadar ? <Auslastungsradar abfahrt={abfahrt} /> : null;

export default connect<StateProps, {}, OwnProps, AbfahrtenState>(state => ({
  auslastungsRadar: state.features.auslastungsradar,
}))(Auslastung);
