/* eslint-disable react/no-unescaped-entities */
import { BRInfo } from './BRInfo';
import { Fahrzeug, InheritedProps } from './Fahrzeug';
import { makeStyles } from '@material-ui/core';
import { useMemo } from 'react';
import type { Fahrzeuggruppe } from 'types/reihung';

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
  gruppe: Fahrzeuggruppe;
  showDestination?: boolean;
  showGruppenZugnummer?: boolean;
  showFahrzeugGruppe: boolean;
  originalTrainNumber: string;
  showUIC: boolean;
}

export const Gruppe = ({
  gruppe,
  showDestination,
  showFahrzeugGruppe,
  showGruppenZugnummer,
  originalTrainNumber,
  ...rest
}: Props) => {
  const classes = useStyles();
  const gruppenPos = {
    left: `${(gruppe.startPercentage - rest.correctLeft) * rest.scale}%`,
    width: `${(gruppe.endPercentage - gruppe.startPercentage) * rest.scale}%`,
  };

  let currentBottom = 2.5;

  if (showFahrzeugGruppe) currentBottom += 1;
  const destinationPos = {
    ...gruppenPos,
    bottom: `${currentBottom}em`,
  };

  const showBR = gruppe.br && gruppe.br.showBRInfo;
  const extraInfoLine = Boolean(showDestination || showBR);

  if (extraInfoLine) currentBottom += 1;
  if (rest.showUIC) currentBottom += 1;
  if (showGruppenZugnummer && gruppe.verkehrlichezugnummer) currentBottom += 1;

  const fahrzeuge = useMemo(
    () =>
      gruppe.allFahrzeug.map((f) => {
        return (
          <Fahrzeug
            {...rest}
            wrongWing={originalTrainNumber !== gruppe.verkehrlichezugnummer}
            key={`${f.fahrzeugnummer}${f.positioningruppe}`}
            fahrzeug={f}
          />
        );
      }),
    [gruppe, originalTrainNumber, rest]
  );

  return (
    <>
      {fahrzeuge}
      {extraInfoLine && (
        <span className={classes.bezeichnung} style={destinationPos}>
          {showBR && gruppe.br && <BRInfo br={gruppe.br} />}
          {showGruppenZugnummer && gruppe.verkehrlichezugnummer && (
            <span>
              {rest.type} {gruppe.verkehrlichezugnummer}
            </span>
          )}
          {showDestination && (
            <span>Ziel: {gruppe.zielbetriebsstellename}</span>
          )}
          {gruppe.name && <span>Zugname: "{gruppe.name}"</span>}
        </span>
      )}

      {showFahrzeugGruppe && (
        <span
          className={classes.bezeichnung}
          data-testid="reihungFahrzeugGruppe"
          style={gruppenPos}
        >
          {gruppe.fahrzeuggruppebezeichnung}
        </span>
      )}
    </>
  );
};
