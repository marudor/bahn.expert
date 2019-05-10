import { Fahrzeuggruppe } from 'types/reihung';
import Fahrzeug, { InheritedProps } from './Fahrzeug';
import React from 'react';
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

  if (showDestination) currentBottom += 1;

  const nummerPos = {
    ...gruppenPos,
    bottom: `${currentBottom}em`,
  };

  return (
    <>
      {gruppe.allFahrzeug.map(f => (
        <Fahrzeug
          {...rest}
          wrongWing={originalTrainNumber !== gruppe.verkehrlichezugnummer}
          key={`${f.fahrzeugnummer}${f.positioningruppe}`}
          fahrzeug={f}
        />
      ))}
      {showDestination && (
        <span className={classes.bezeichnung} style={destinationPos}>
          {gruppe.zielbetriebsstellename}
        </span>
      )}
      {showGruppenZugnummer && gruppe.verkehrlichezugnummer && (
        <span className={classes.bezeichnung} style={nummerPos}>
          {rest.type} {gruppe.verkehrlichezugnummer}
        </span>
      )}
      {showFahrzeugGruppe && (
        <span className={classes.bezeichnung} style={gruppenPos}>
          {gruppe.fahrzeuggruppebezeichnung}
        </span>
      )}
    </>
  );
};

export default Gruppe;
