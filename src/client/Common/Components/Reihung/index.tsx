import { Abfahrt } from 'types/abfahrten';
import { CommonState } from 'AppState';
import { connect, ResolveThunks } from 'react-redux';
import { getReihung } from 'Common/actions/reihung';
import { getReihungForId } from 'Common/selector/reihung';
import { Reihung } from 'types/reihung';
import { withStyles, WithStyles } from '@material-ui/styles';
import Gruppe from './Gruppe';
import Loading from 'Common/Components/Loading';
import React from 'react';
import Sektor from './Sektor';
import styles from './index.styles';

type StateProps = {
  reihung: null | Reihung;
};

type OwnProps = {
  useZoom: boolean;
  fahrzeugGruppe: boolean;
  trainNumber: string;
  currentStation: string;
  scheduledDeparture: number;
};

type DispatchProps = ResolveThunks<{
  getReihung: typeof getReihung;
}>;

export type ReduxProps = StateProps & OwnProps & DispatchProps;

type Props = ReduxProps & WithStyles<typeof styles>;

class ReihungComp extends React.PureComponent<Props> {
  componentDidMount() {
    const {
      reihung,
      getReihung,
      trainNumber,
      currentStation,
      scheduledDeparture,
    } = this.props;

    if (!reihung) {
      getReihung(trainNumber, currentStation, scheduledDeparture);
    }
  }

  render() {
    const {
      reihung,
      useZoom,
      fahrzeugGruppe,
      trainNumber,
      classes,
    } = this.props;

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
              originalTrainNumber={trainNumber}
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

export default connect<StateProps, DispatchProps, OwnProps, CommonState>(
  (state, props) => ({
    reihung: getReihungForId(state, props),
  }),
  { getReihung }
)(withStyles(styles)(ReihungComp));
