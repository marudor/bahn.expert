import { CommonState } from 'AppState';
import { connect, ResolveThunks } from 'react-redux';
import { getReihung } from 'Common/actions/reihung';
import { getReihungForId } from 'Common/selector/reihung';
import { Reihung } from 'types/reihung';
import cc from 'classnames';
import Gruppe from './Gruppe';
import Loading from 'Common/Components/Loading';
import React, { useEffect } from 'react';
import Sektor from './Sektor';
import useStyles from './index.style';

type StateProps = {
  reihung: null | Reihung;
};

type OwnProps = {
  className?: string;
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

type Props = ReduxProps;

const ReihungComp = (props: Props) => {
  const {
    className,
    currentStation,
    fahrzeugGruppe,
    getReihung,
    reihung,
    scheduledDeparture,
    trainNumber,
    useZoom,
  } = props;
  const classes = useStyles(props);

  useEffect(() => {
    if (!reihung) {
      getReihung(trainNumber, currentStation, scheduledDeparture);
    }
  }, [currentStation, getReihung, reihung, scheduledDeparture, trainNumber]);

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
    <div className={cc(classes.wrap, className)}>
      <div className={classes.main}>
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
              type={reihung.zuggattung}
              showDestination={reihung.differentDestination}
              key={g.fahrzeuggruppebezeichnung}
              gruppe={g}
            />
          ))}
        </div>
        <span className={classes.richtung} />
      </div>
    </div>
  );
};

export default connect<StateProps, DispatchProps, OwnProps, CommonState>(
  (state, props) => ({
    reihung: getReihungForId(state, props),
  }),
  { getReihung }
)(ReihungComp);
