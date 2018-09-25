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

type ReduxProps = {
  auslastung: ?{ first: 0 | 1 | 2, second: 0 | 1 | 2 },
};
type OwnProps = {
  abfahrt: Abfahrt,
};
type Props = ReduxProps &
  OwnProps & {
    getAuslastung: typeof getAuslastung,
  };

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

    if (!auslastung) {
      getAuslastung(abfahrt.trainId);
    }
  }

  preventDefault = e => {
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

export default connect(
  (state: AppState, props: OwnProps): ReduxProps => ({
    auslastung: getAuslastungForIdAndStation(state, props),
  }),
  {
    getAuslastung,
  }
)(Auslastung);
