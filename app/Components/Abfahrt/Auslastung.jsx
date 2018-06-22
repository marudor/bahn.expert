// @flow
import './Auslastung.scss';
import { type Abfahrt } from 'types/abfahrten';
import { connect } from 'react-redux';
import { getAuslastung } from 'actions/auslastung';
import { getAuslastungForIdAndStation } from 'selector/auslastung';
import Loading from '../Loading';
import React from 'react';
import type { AppState } from 'AppState';

type ReduxProps = {
  auslastung: { first: 0 | 1 | 2, second: 0 | 1 | 2 },
};
type OwnProps = {
  abfahrt: Abfahrt,
};
type Props = ReduxProps &
  OwnProps & {
    getAuslastung: typeof getAuslastung,
  };

class Auslastung extends React.PureComponent<Props> {
  componentDidMount() {
    const { auslastung, getAuslastung, abfahrt } = this.props;

    if (!auslastung) {
      getAuslastung(abfahrt.trainId);
    }
  }

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
          <span className={`Auslastung__icon A${auslastung.first}`} />
        </div>
        <div className="Auslastung__entry">
          <span>2</span>
          <span className={`Auslastung__icon A${auslastung.second}`} />
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
