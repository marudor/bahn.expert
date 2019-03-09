// @flow
import './index.scss';
import { connect } from 'react-redux';
import { getReihung } from 'client/actions/reihung';
import { getReihungForId } from 'client/selector/reihung';
import cc from 'classnames';
import Gruppe from './Gruppe';
import Loading from 'client/Components/Loading';
import React from 'react';
import Sektor from './Sektor';
import type { Abfahrt } from 'types/abfahrten';
import type { AppState } from 'AppState';
import type { Reihung } from 'types/reihung';

type StateProps = {|
  +reihung: ?Reihung,
  +useZoom: boolean,
  +fahrzeugGruppe: boolean,
|};

type OwnProps = {|
  +abfahrt: Abfahrt,
|};

type DispatchProps = {|
  +getReihung: typeof getReihung,
|};

type Props = {|
  ...StateProps,
  ...OwnProps,
  ...DispatchProps,
|};

class ReihungComp extends React.PureComponent<Props> {
  componentDidMount() {
    const { reihung, getReihung, abfahrt } = this.props;

    if (!reihung) {
      getReihung(abfahrt);
    }
  }

  render() {
    const { reihung, useZoom, fahrzeugGruppe, abfahrt } = this.props;

    if (reihung === null) {
      return null;
    }
    if (reihung === undefined) {
      return <Loading type={1} />;
    }

    const correctLeft = useZoom ? reihung.startPercentage : 0;
    const scale = useZoom ? reihung.scale : 1;
    const differentZugnummer = reihung.differentZugnummer;

    let height = 5;

    if (fahrzeugGruppe) height += 1;
    if (differentZugnummer) height += 1;

    const style = {
      height: `${height}em`,
    };

    return (
      <div className="Reihung" style={style}>
        {Boolean(reihung.specificTrainType) && (
          <span className="Reihung__specificType">{reihung.specificTrainType}</span>
        )}
        <div className="Reihung__sektoren">
          {reihung.halt.allSektor.map(s => (
            <Sektor correctLeft={correctLeft} scale={scale} key={s.sektorbezeichnung} sektor={s} />
          ))}
        </div>
        <div className="Reihung__reihung">
          {reihung.allFahrzeuggruppe.map(g => (
            <Gruppe
              showGruppenZugnummer={differentZugnummer}
              originalTrainNumber={abfahrt.trainNumber}
              showFahrzeugGruppe={fahrzeugGruppe}
              correctLeft={correctLeft}
              scale={scale}
              specificType={reihung.specificTrainType}
              type={reihung.zuggattung}
              showDestination={reihung.differentDestination}
              key={g.fahrzeuggruppebezeichnung}
              gruppe={g}
            />
          ))}
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

export default connect<Props, OwnProps, StateProps, DispatchProps, AppState, _>(
  (state, props) => ({
    reihung: getReihungForId(state, props),
    useZoom: state.config.config.zoomReihung,
    fahrzeugGruppe: state.config.config.fahrzeugGruppe,
  }),
  { getReihung }
)(ReihungComp);
