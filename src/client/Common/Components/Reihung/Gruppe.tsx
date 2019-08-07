import { Fahrzeuggruppe } from 'types/reihung';
import BRInfo from './BRInfo';
import Fahrzeug, { InheritedProps } from './Fahrzeug';
import React, { useMemo } from 'react';
import useStyles from './Gruppe.style';

type OwnProps = InheritedProps & {
  gruppe: Fahrzeuggruppe;
  showDestination: boolean;
  showGruppenZugnummer: boolean;
  showFahrzeugGruppe: boolean;
  originalTrainNumber: string;
};
type Props = OwnProps;

const Gruppe = ({
  gruppe,
  showDestination,
  showFahrzeugGruppe,
  showGruppenZugnummer,
  originalTrainNumber,
  ...rest
}: Props) => {
  const classes = useStyles();
  const gruppenPos = {
    left: `${(gruppe.startProzent - rest.correctLeft) * rest.scale}%`,
    width: `${(gruppe.endeProzent - gruppe.startProzent) * rest.scale}%`,
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

  const nummerPos = {
    ...gruppenPos,
    bottom: `${currentBottom}em`,
  };

  const fahrzeuge = useMemo(
    () =>
      gruppe.allFahrzeug.map(f => {
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
          {showBR && gruppe.br && (
            <BRInfo className={classes.br} br={gruppe.br} />
          )}
          {showDestination && gruppe.zielbetriebsstellename}
        </span>
      )}
      {showGruppenZugnummer && gruppe.verkehrlichezugnummer && (
        <span className={classes.bezeichnung} style={nummerPos}>
          {rest.type} {gruppe.verkehrlichezugnummer}
        </span>
      )}
      {showFahrzeugGruppe && (
        <span
          data-testid="reihungFahrzeugGruppe"
          className={classes.bezeichnung}
          style={gruppenPos}
        >
          {gruppe.fahrzeuggruppebezeichnung}
        </span>
      )}
    </>
  );
};

export default Gruppe;
