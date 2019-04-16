import { Abfahrt } from 'types/abfahrten';
import { AbfahrtenState } from 'AppState';
import { connect, ResolveThunks } from 'react-redux';
import { getReihung } from 'Abfahrten/actions/reihung';
import { getReihungForId } from 'Abfahrten/selector/reihung';
import { Reihung } from 'types/reihung';
import Gruppe from './Gruppe';
import Loading from 'Abfahrten/Components/Loading';
import React from 'react';
import Sektor from './Sektor';
import styles from './index.styles';
import withStyles, { WithStyles } from 'react-jss';

type StateProps = {
  reihung: null | Reihung;
  useZoom: boolean;
  fahrzeugGruppe: boolean;
};

type OwnProps = {
  abfahrt: Abfahrt;
};

type DispatchProps = ResolveThunks<{
  getReihung: typeof getReihung;
}>;

export type ReduxProps = StateProps & OwnProps & DispatchProps;

type Props = ReduxProps & WithStyles<typeof styles>;

class ReihungComp extends React.PureComponent<Props> {
  componentDidMount() {
    const { reihung, getReihung, abfahrt } = this.props;

    if (!reihung) {
      getReihung(abfahrt);
    }
  }

  render() {
    const { reihung, useZoom, fahrzeugGruppe, abfahrt, classes } = this.props;

    if (reihung === null) {
      return null;
    }
    if (reihung === undefined) {
      return <Loading type={1} />;
    }

    const correctLeft = useZoom ? reihung.startPercentage : 0;
    const scale = useZoom ? reihung.scale : 1;
    const differentZugnummer = reihung.differentZugnummer;

    return (
      <div className={classes.main}>
        {Boolean(reihung.specificTrainType) && (
          <span className={classes.specificType}>
            {reihung.specificTrainType}
          </span>
        )}
        <div className={classes.sektoren}>
          {reihung.halt.allSektor.map(s => (
            <Sektor
              correctLeft={correctLeft}
              scale={scale}
              key={s.sektorbezeichnung}
              sektor={s}
            />
          ))}
        </div>
        <div className={classes.reihung}>
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
        <span className={classes.richtung} />
      </div>
    );
  }
}

export default connect<StateProps, DispatchProps, OwnProps, AbfahrtenState>(
  (state, props) => ({
    reihung: getReihungForId(state, props),
    useZoom: state.config.config.zoomReihung,
    fahrzeugGruppe: state.config.config.fahrzeugGruppe,
  }),
  { getReihung }
)(withStyles(styles)(ReihungComp));
