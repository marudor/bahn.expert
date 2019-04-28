import * as React from 'react';
import { AbfahrtenState } from 'AppState';
import { connect, ResolveThunks } from 'react-redux';
import { getAuslastung } from 'Abfahrten/actions/auslastung';
import { Route$Auslastung } from 'types/routing';
import AuslastungsDisplay from 'Common/Components/AuslastungsDisplay';
import Loading from 'Common/Components/Loading';

type StateProps = {
  auslastungsFeature: boolean;
  auslastung?: null | Route$Auslastung;
};
type DispatchProps = ResolveThunks<{
  getAuslastung: typeof getAuslastung;
}>;
type OwnProps = {
  trainNumber: string;
  start: string;
  destination: string;
  departure: number;
};
type ReduxProps = StateProps & DispatchProps & OwnProps;

type Props = ReduxProps;

class Auslastung extends React.PureComponent<Props> {
  componentDidMount() {
    const {
      auslastung,
      getAuslastung,
      trainNumber,
      start,
      destination,
      departure,
      auslastungsFeature,
    } = this.props;

    if (auslastungsFeature && !auslastung) {
      getAuslastung(trainNumber, start, destination, departure);
    }
  }

  preventDefault = (e: React.SyntheticEvent<Element>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  render() {
    const { auslastung, auslastungsFeature } = this.props;

    if (auslastung === null || !auslastungsFeature) {
      return null;
    }

    if (auslastung === undefined) {
      return <Loading type={1} />;
    }

    return <AuslastungsDisplay auslastung={auslastung} />;
  }
}

export default connect<StateProps, DispatchProps, OwnProps, AbfahrtenState>(
  (state, props) => ({
    auslastungsFeature: state.features.auslastung,
    auslastung:
      state.auslastung.auslastung[
        `${props.start}/${props.destination}/${props.trainNumber}`
      ],
  }),
  {
    getAuslastung,
  }
)(Auslastung);
