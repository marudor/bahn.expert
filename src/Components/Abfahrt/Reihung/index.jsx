// @flow
import './index.scss';
import { connect } from 'react-redux';
import { getReihung } from 'actions/reihung';
import { getReihungForId } from 'selector/reihung';
import Gruppe from './Gruppe';
import Loading from 'Components/Loading';
import React from 'react';
import Sektor from './Sektor';
import type { Abfahrt } from 'types/abfahrten';
import type { AppState } from 'AppState';
import type { Reihung } from 'types/reihung';

type ReduxProps = {
  reihung: Reihung,
};

type OwnProps = {
  abfahrt: Abfahrt,
};

type Props = ReduxProps &
  OwnProps & {
    getReihung: typeof getReihung,
  };

class ReihungComp extends React.PureComponent<Props> {
  componentDidMount() {
    const { reihung, getReihung, abfahrt } = this.props;

    if (!reihung) {
      getReihung(abfahrt);
    }
  }

  render() {
    const { reihung } = this.props;

    if (reihung === null) {
      return null;
    }
    if (reihung === undefined) {
      return <Loading type={1} />;
    }

    return (
      <div className="Reihung">
        <div className="Reihung__sektoren">
          {reihung.halt.allSektor.map(s => <Sektor key={s.sektorbezeichnung} sektor={s} />)}
        </div>
        <div className="Reihung__reihung">
        {reihung.allFahrzeuggruppe.map(g => <Gruppe key={g.fahrzeuggruppebezeichnung} gruppe={g} />)}
        </div>
      </div>
    );
  }
}

export default connect(
  (state: AppState, props: OwnProps): ReduxProps => ({
    reihung: getReihungForId(state, props),
  }),
  { getReihung }
)(ReihungComp);
