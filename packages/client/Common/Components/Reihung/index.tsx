import { Explain } from './Explain';
import { Gruppe } from './Gruppe';
import { Loading } from 'client/Common/Components/Loading';
import { makeStyles } from '@material-ui/core';
import { Sektor } from './Sektor';
import { useCommonConfig } from 'client/Common/provider/CommonConfigProvider';
import { useEffect, useMemo } from 'react';
import {
  useReihungen,
  useReihungenActions,
} from 'client/Common/provider/ReihungenProvider';
import clsx from 'clsx';
import type { FC } from 'react';

const useStyles = makeStyles((theme) => ({
  wrap: {
    overflowX: 'auto',
  },
  main: {
    minWidth: '70em',
    overflow: 'hidden',
    position: 'relative',
    fontSize: '170%',
    marginBottom: '1em',
    marginRight: '.3em',
  },
  sektoren: {
    position: 'relative',
  },
  reihungWrap: {
    position: 'relative',
    marginTop: '1.3em',
    height: '100%',
  },
  plan: {
    position: 'absolute',
    bottom: '1.5em',
  },
  richtung: {
    backgroundColor: theme.palette.text.primary,
    width: '50%',
    height: 2,
    position: 'absolute',
    left: '50%',
    bottom: '.5em',
    zIndex: 10,
    transform: 'translateX(-50%)',
    '&::after': {
      border: `solid ${theme.palette.text.primary}`,
      borderWidth: '0 2px 2px 0',
      display: 'inline-block',
      padding: 3,
      content: '""',
      transform: 'rotate(135deg)',
      position: 'absolute',
      top: -3,
    },
  },
  reverseRichtung: {
    transform: 'rotate(180deg) translateX(50%)',
  },
}));

interface Props {
  className?: string;
  trainNumber: string;
  trainType?: string;
  fallbackTrainNumbers?: string[];
  currentEvaNumber: string;
  scheduledDeparture: Date;
  loadHidden?: boolean;
  withLegend?: boolean;
}

export const Reihung: FC<Props> = ({
  className,
  currentEvaNumber,
  scheduledDeparture,
  trainNumber,
  trainType,
  loadHidden,
  fallbackTrainNumbers,
}) => {
  const classes = useStyles();
  const reihungen = useReihungen();
  const { getReihung } = useReihungenActions();
  const { fahrzeugGruppe, showUIC } = useCommonConfig();
  const reihung =
    reihungen[
      `${trainNumber}${currentEvaNumber}${scheduledDeparture.toISOString()}`
    ];

  useEffect(() => {
    if (reihung === undefined) {
      void getReihung(
        trainNumber,
        trainType,
        currentEvaNumber,
        scheduledDeparture,
        fallbackTrainNumbers,
      );
    }
  }, [
    currentEvaNumber,
    fallbackTrainNumbers,
    getReihung,
    reihung,
    scheduledDeparture,
    trainNumber,
    trainType,
  ]);

  const mainStyle = useMemo(() => {
    if (!reihung) return {};
    let height = 8;
    if (fahrzeugGruppe) height += 1;
    if (showUIC) height += 1;
    if (reihung.differentZugnummer) height += 1;
    if (reihung.differentDestination) height += 1;
    if (reihung.allFahrzeuggruppe.find((g) => g.br && g.br.showBRInfo))
      height += 1;
    if (reihung.allFahrzeuggruppe.some((g) => g.name)) height += 1;
    return {
      height: `${height}em`,
    };
  }, [fahrzeugGruppe, showUIC, reihung]);

  if (reihung === null || (!reihung && loadHidden)) {
    return null;
  }
  if (reihung === undefined) {
    return <Loading type={1} />;
  }

  return (
    <div className={clsx(classes.wrap, className)} data-testid="reihung">
      <div className={classes.main} style={mainStyle}>
        <div className={classes.sektoren}>
          {reihung.halt.allSektor.map((s) => (
            <Sektor
              correctLeft={reihung.startPercentage}
              scale={reihung.scale}
              key={s.sektorbezeichnung}
              sektor={s}
            />
          ))}
        </div>
        <div className={classes.reihungWrap}>
          {reihung.allFahrzeuggruppe.map((g) => (
            <Gruppe
              showGruppenZugnummer={reihung.differentZugnummer}
              showUIC={showUIC}
              originalTrainNumber={trainNumber}
              showFahrzeugGruppe={fahrzeugGruppe}
              correctLeft={reihung.startPercentage}
              scale={reihung.scale}
              type={reihung.zuggattung}
              showDestination={
                reihung.differentDestination && g.allFahrzeug.length > 1
              }
              key={g.fahrzeuggruppebezeichnung}
              gruppe={g}
            />
          ))}
        </div>
        <Explain />
        {!reihung.isRealtime && <span className={classes.plan}>Plandaten</span>}
        <span
          className={clsx(
            classes.richtung,
            !reihung.realFahrtrichtung && classes.reverseRichtung,
          )}
        />
      </div>
    </div>
  );
};
// eslint-disable-next-line import/no-default-export
export default Reihung;
