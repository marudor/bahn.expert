// @flow
import './Auslastung.scss';
import { type Abfahrt } from 'types/abfahrten';
import { connect } from 'react-redux';
import { getAuslastung } from 'client/actions/auslastung';
import { getAuslastungForIdAndStation } from 'client/selector/auslastung';
import Loading from '../Loading';
import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import type { AppState } from 'AppState';

type StateProps = {|
  auslastung: ?{ first: 0 | 1 | 2, second: 0 | 1 | 2 },
|};
type DispatchProps = {|
  getAuslastung: typeof getAuslastung,
|};
type OwnProps = {|
  abfahrt: Abfahrt,
|};
type Props = {|
  ...StateProps,
  ...DispatchProps,
  ...OwnProps,
|};

function getTooltipText(auslastung) {
  switch (auslastung) {
    case 0:
      return 'Nicht ausgelastet';
    case 1:
      return 'Zug ausgelastet';
    case 2:
      return 'Zug stark ausgelastet';
    default:
      return 'Unbekannt';
  }
}

class Auslastung extends React.PureComponent<Props> {
  componentDidMount() {
    const { auslastung, getAuslastung, abfahrt } = this.props;

    if (!auslastung && !abfahrt.isCancelled && abfahrt.scheduledDeparture) {
      getAuslastung(abfahrt.trainId);
    }
  }

  preventDefault = (e: SyntheticEvent<>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  render() {
    const { auslastung, abfahrt } = this.props;

    if (auslastung === null || abfahrt.isCancelled || !abfahrt.scheduledDeparture) {
      return null;
    }

    if (auslastung === undefined) {
      return <Loading type={1} />;
    }

    return (
      <div className="Auslastung">
        <div className="Auslastung__entry">
          <span>1</span>
          <Tooltip title={getTooltipText(auslastung.first)}>
            <span className={`Auslastung__icon A${auslastung.first}`} />
          </Tooltip>
        </div>
        <div className="Auslastung__entry">
          <span>2</span>
          <Tooltip title={getTooltipText(auslastung.second)}>
            <span className={`Auslastung__icon A${auslastung.second}`} />
          </Tooltip>
        </div>
      </div>
    );
  }
}

export default connect<AppState, Function, OwnProps, StateProps, DispatchProps>(
  (state: AppState, props: OwnProps): StateProps => ({
    auslastung: getAuslastungForIdAndStation(state, props),
  }),
  ({
    getAuslastung,
  }: DispatchProps)
)(Auslastung);
