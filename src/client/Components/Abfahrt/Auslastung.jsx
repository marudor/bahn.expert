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
import Done from '@material-ui/icons/Done';
import ErrorOutline from '@material-ui/icons/ErrorOutline';
import Close from '@material-ui/icons/Close';
import Help from '@material-ui/icons/Help';

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

function getIcon(auslastung) {
  switch (auslastung) {
    case 0:
      return <Done />;
    case 1:
      return <ErrorOutline />;
    case 2:
      return <Close />;
    default:
      return <Help />;
  }
}

class Auslastung extends React.PureComponent<Props> {
  componentDidMount() {
    const { auslastung, getAuslastung, abfahrt } = this.props;

    if (!auslastung) {
      getAuslastung(abfahrt.trainId);
    }
  }

  preventDefault = (e: SyntheticEvent<>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  render() {
    const { auslastung } = this.props;

    if (auslastung === null) {
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
            <span className={`Auslastung__icon A${auslastung.first}`}>
              {getIcon(auslastung.first)}
            </span>
          </Tooltip>
        </div>
        <div className="Auslastung__entry">
          <span>2</span>
          <Tooltip title={getTooltipText(auslastung.second)}>
            <span className={`Auslastung__icon A${auslastung.second}`}>
              {getIcon(auslastung.second)}
            </span>
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
