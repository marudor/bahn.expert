/* eslint-disable react/no-unescaped-entities */
import { BRInfo } from 'client/Common/Components/Reihung/BRInfo';
import { Fahrzeug } from './Fahrzeug';
import { makeStyles } from '@material-ui/core';
import { useMemo } from 'react';
import type { CoachSequenceGroup } from 'types/coachSequence';
import type { FC } from 'react';
import type { InheritedProps } from './Fahrzeug';

const useStyles = makeStyles({
  bezeichnung: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'absolute',
    bottom: '2.5em',
  },
});

interface Props extends InheritedProps {
  gruppe: CoachSequenceGroup;
  showDestination?: boolean;
  showGruppenZugnummer?: boolean;
  showFahrzeugGruppe: boolean;
  originalTrainNumber: string;
  showUIC: boolean;
}

const RPFRegex = /(RP)(F\d)(\d{5})/;

export const Gruppe: FC<Props> = ({
  gruppe,
  showDestination,
  showFahrzeugGruppe,
  showGruppenZugnummer,
  originalTrainNumber,
  ...rest
}) => {
  const classes = useStyles();
  const gruppenPos = useMemo(() => {
    const groupStart = Math.min(
      ...gruppe.coaches.map((c) => c.position.startPercent),
    );
    const groupEnd = Math.max(
      ...gruppe.coaches.map((c) => c.position.endPercent),
    );
    return {
      left: `${(groupStart - rest.correctLeft) * rest.scale}%`,
      width: `${(groupEnd - groupStart) * rest.scale}%`,
    };
  }, [gruppe.coaches, rest.correctLeft, rest.scale]);

  const extraInfoLine = Boolean(
    showFahrzeugGruppe ||
      showGruppenZugnummer ||
      showDestination ||
      gruppe.trainName ||
      gruppe.baureihe,
  );

  const fahrzeuge = useMemo(() => {
    const wrongWing =
      originalTrainNumber !== gruppe.number &&
      gruppe.coaches.some((f) => !f.closed);
    return gruppe.coaches.map((c) => {
      return (
        <Fahrzeug
          {...rest}
          identifier={gruppe.baureihe?.identifier}
          wrongWing={wrongWing}
          key={`${c.uic}${c.position}`}
          fahrzeug={c}
        />
      );
    });
  }, [gruppe, originalTrainNumber, rest]);

  return (
    <>
      {fahrzeuge}
      {extraInfoLine && (
        <span className={classes.bezeichnung} style={gruppenPos}>
          {gruppe.baureihe && <BRInfo br={gruppe.baureihe} />}
          {showGruppenZugnummer && gruppe.number && (
            <span>
              {rest.type} {gruppe.number}
            </span>
          )}
          {showDestination && <span>Ziel: {gruppe.destinationName}</span>}
          {gruppe.trainName && <span>Zugname: "{gruppe.trainName}"</span>}
          {showFahrzeugGruppe && (
            <span data-testid="reihungFahrzeugGruppe">
              {gruppe.name.replace(RPFRegex, '$1 $2 $3')}
            </span>
          )}
        </span>
      )}
    </>
  );
};
