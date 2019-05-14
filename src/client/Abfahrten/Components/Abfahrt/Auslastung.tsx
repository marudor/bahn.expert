import { Abfahrt } from 'types/abfahrten';
import { AbfahrtenState } from 'AppState';
import { connect, ResolveThunks } from 'react-redux';
import { getAuslastung } from 'Abfahrten/actions/auslastung';
import { Route$Auslastung } from 'types/routing';
import AuslastungsDisplay from 'Common/Components/AuslastungsDisplay';
import Loading from 'Common/Components/Loading';
import React, { useEffect } from 'react';

type StateProps = {
  auslastungsFeature: boolean;
  auslastung?: null | Route$Auslastung;
};
type DispatchProps = ResolveThunks<{
  getAuslastung: typeof getAuslastung;
}>;
type OwnProps = {
  abfahrt: Abfahrt;
};
type ReduxProps = StateProps & DispatchProps & OwnProps;

type Props = ReduxProps;

const Auslastung = ({
  auslastung,
  getAuslastung,
  abfahrt,
  auslastungsFeature,
}: Props) => {
  useEffect(() => {
    if (auslastungsFeature && !auslastung && abfahrt.departure) {
      getAuslastung(
        abfahrt.trainNumber,
        abfahrt.currentStation.id,
        abfahrt.destination,
        abfahrt.departure.scheduledTime
      );
    }
  }, [abfahrt, auslastung, auslastungsFeature, getAuslastung]);

  if (auslastung === null || !auslastungsFeature) {
    return null;
  }

  if (auslastung === undefined) {
    return <Loading type={1} />;
  }

  return <AuslastungsDisplay auslastung={auslastung} />;
};

export default connect<StateProps, DispatchProps, OwnProps, AbfahrtenState>(
  (state, props) => ({
    auslastungsFeature: state.features.auslastung,
    auslastung:
      state.auslastung.auslastung[
        `${props.abfahrt.currentStation.id}/${props.abfahrt.destination}/${
          props.abfahrt.trainNumber
        }`
      ],
  }),
  {
    getAuslastung,
  }
)(Auslastung);
