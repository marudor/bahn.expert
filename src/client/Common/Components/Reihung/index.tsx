import { getReihung } from 'Common/actions/reihung';
import { getReihungForId } from 'Common/selector/reihung';
import { useCommonSelector } from 'useSelector';
import { useDispatch } from 'react-redux';
import cc from 'clsx';
import Gruppe from './Gruppe';
import Loading from 'Common/Components/Loading';
import React, { useEffect } from 'react';
import Sektor from './Sektor';
import useStyles from './index.style';

type Props = {
  className?: string;
  useZoom: boolean;
  fahrzeugGruppe: boolean;
  trainNumber: string;
  currentStation: string;
  scheduledDeparture: number;
};

const ReihungComp = (props: Props) => {
  const {
    className,
    currentStation,
    fahrzeugGruppe,
    scheduledDeparture,
    trainNumber,
    useZoom,
  } = props;
  const reihung = useCommonSelector(state => getReihungForId(state, props));
  const classes = useStyles({
    reihung,
    fahrzeugGruppe,
  });
  const dispatch = useDispatch();

  useEffect(() => {
    if (!reihung) {
      dispatch(getReihung(trainNumber, currentStation, scheduledDeparture));
    }
  }, [currentStation, dispatch, reihung, scheduledDeparture, trainNumber]);

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

export default ReihungComp;
