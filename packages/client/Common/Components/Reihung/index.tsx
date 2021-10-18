import { Explain } from './Explain';
import { Gruppe } from './Gruppe';
import { Loading } from 'client/Common/Components/Loading';
import { makeStyles } from '@material-ui/core';
import { Sektor } from './Sektor';
import { sequenceId } from 'client/Common/provider/ReihungenProvider';
import { useCommonConfig } from 'client/Common/provider/CommonConfigProvider';
import { useEffect, useMemo } from 'react';
import {
  useSequences,
  useSequencesActions,
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
  fallbackTrainNumbers?: string[];
  currentEvaNumber: string;
  scheduledDeparture: Date;
  initialDeparture?: Date;
  loadHidden?: boolean;
  withLegend?: boolean;
}

export const Reihung: FC<Props> = ({
  className,
  currentEvaNumber,
  scheduledDeparture,
  trainNumber,
  initialDeparture,
  loadHidden,
  fallbackTrainNumbers,
}) => {
  const classes = useStyles();
  const sequences = useSequences();
  const { getSequences } = useSequencesActions();
  const { fahrzeugGruppe, showUIC } = useCommonConfig();
  const sequence =
    sequences[sequenceId(trainNumber, currentEvaNumber, scheduledDeparture)];

  useEffect(() => {
    if (sequence === undefined) {
      void getSequences(
        trainNumber,
        currentEvaNumber,
        scheduledDeparture,
        initialDeparture,
        fallbackTrainNumbers,
      );
    }
  }, [
    currentEvaNumber,
    fallbackTrainNumbers,
    getSequences,
    initialDeparture,
    sequence,
    scheduledDeparture,
    trainNumber,
  ]);

  const [scale, startPercent] = useMemo(() => {
    if (!sequence) return [1, 0];
    const coaches = sequence.sequence.groups.flatMap((g) => g.coaches);
    const endPercent = Math.max(...coaches.map((c) => c.position.endPercent));
    const startPercent = Math.min(
      ...coaches.map((c) => c.position.startPercent),
    );
    return [100 / (endPercent - startPercent), startPercent];
  }, [sequence]);

  const mainStyle = useMemo(() => {
    if (!sequence) return {};
    let height = 7.5;
    if (fahrzeugGruppe) height += 1;
    if (showUIC) height += 1;
    if (sequence.multipleDestinations) height += 1;
    if (sequence.multipleTrainNumbers) height += 1;

    let withName = false;
    let withBR = false;
    let withSeats = false;
    for (const g of sequence.sequence.groups) {
      if (g.trainName) withName = true;
      if (g.baureihe) withBR = true;
      for (const c of g.coaches) {
        if (c.seats) withSeats = true;
      }
    }

    if (withName) height += 1;
    if (withBR) height += 1;
    if (withSeats) height += 1;

    return {
      height: `${height}em`,
    };
  }, [fahrzeugGruppe, showUIC, sequence]);

  if (sequence === null || (!sequence && loadHidden)) {
    return null;
  }
  if (sequence === undefined) {
    return <Loading type={1} />;
  }

  return (
    <div className={clsx(classes.wrap, className)} data-testid="reihung">
      <div className={classes.main} style={mainStyle}>
        <div className={classes.sektoren}>
          {sequence.stop.sectors.map((s) => (
            <Sektor
              correctLeft={startPercent}
              scale={scale}
              key={s.name}
              sector={s}
            />
          ))}
        </div>
        <div className={classes.reihungWrap}>
          {sequence.sequence.groups.map((g, i) => (
            <Gruppe
              showUIC={showUIC}
              originalTrainNumber={trainNumber}
              showFahrzeugGruppe={fahrzeugGruppe}
              correctLeft={startPercent}
              scale={scale}
              type={sequence.product.type}
              showDestination={
                sequence.multipleDestinations && g.coaches.length > 1
              }
              showGruppenZugnummer={sequence.multipleTrainNumbers}
              gruppe={g}
              key={i}
            />
          ))}
        </div>
        <Explain />
        {!sequence.isRealtime && (
          <span className={classes.plan}>Plandaten</span>
        )}
        {sequence.direction != null && (
          <span
            className={clsx(
              classes.richtung,
              !sequence.direction && classes.reverseRichtung,
            )}
          />
        )}
      </div>
    </div>
  );
};
// eslint-disable-next-line import/no-default-export
export default Reihung;
