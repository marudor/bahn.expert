import cc from 'clsx';
import CommonConfigContainer from 'Common/container/CommonConfigContainer';
import Explain from './Explain';
import Gruppe from './Gruppe';
import Loading from 'Common/Components/Loading';
import React, { useEffect } from 'react';
import ReihungContainer from 'Common/container/ReihungContainer';
import Sektor from './Sektor';
import useStyles from './index.style';

interface Props {
  className?: string;
  trainNumber: string;
  currentStation: string;
  scheduledDeparture: number;
  loadHidden?: boolean;
  withLegend?: boolean;
}

const Reihung = (props: Props) => {
  const {
    className,
    currentStation,
    scheduledDeparture,
    trainNumber,
    loadHidden,
  } = props;
  const { reihungen, getReihung } = ReihungContainer.useContainer();
  const {
    fahrzeugGruppe,
    showUIC,
    zoomReihung,
  } = CommonConfigContainer.useContainer().config;
  const reihung = reihungen[trainNumber + currentStation + scheduledDeparture];
  const classes = useStyles({
    reihung,
    fahrzeugGruppe,
    showUIC,
  });

  useEffect(() => {
    if (reihung === undefined) {
      getReihung(trainNumber, currentStation, scheduledDeparture);
    }
  }, [currentStation, getReihung, reihung, scheduledDeparture, trainNumber]);

  if (reihung === null || (!reihung && loadHidden)) {
    return null;
  }
  if (reihung === undefined) {
    return <Loading type={1} />;
  }

  const correctLeft = zoomReihung ? reihung.startPercentage : 0;
  const scale = zoomReihung ? reihung.scale : 1;
  const differentZugnummer = reihung.differentZugnummer;

  return (
    <div className={cc(classes.wrap, className)} data-testid="reihung">
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
              showUIC={showUIC}
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
        <Explain />
        <span className={classes.richtung} />
      </div>
    </div>
  );
};

export default Reihung;
