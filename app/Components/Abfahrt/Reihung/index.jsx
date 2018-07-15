// @flow
import './index.scss';
import { connect } from 'react-redux';
import { getReihung } from 'actions/reihung';
import { getReihungForId } from 'selector/reihung';
import cc from 'classcat';
import Gruppe from './Gruppe';
import Loading from 'Components/Loading';
import React from 'react';
import ReihungContext from './ReihungContext';
import Sektor from './Sektor';
import type { Abfahrt } from 'types/abfahrten';
import type { AppState } from 'AppState';
import type { Reihung } from 'types/reihung';

type ReduxProps = {
  reihung: ?Reihung,
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
        {Boolean(reihung.specificTrainType) && (
          <span className="Reihung__specificType">{reihung.specificTrainType}</span>
        )}
        <div className="Reihung__sektoren">
          {reihung.halt.allSektor.map(s => <Sektor key={s.sektorbezeichnung} sektor={s} />)}
        </div>
        <div className="Reihung__reihung">
          <ReihungContext.Provider value={{ specificType: reihung.specificTrainType, type: reihung.zuggattung }}>
            {reihung.allFahrzeuggruppe.map(g => (
              <Gruppe
                specificType={reihung.specificTrainType}
                type={reihung.zuggattung}
                showDestination={reihung.differentDestination}
                key={g.fahrzeuggruppebezeichnung}
                gruppe={g}
              />
            ))}
          </ReihungContext.Provider>
        </div>
        <span
          className={cc([
            'Reihung__richtung',
            {
              'Reihung__richtung--reverse': !reihung.realFahrtrichtung,
            },
          ])}
        />
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
