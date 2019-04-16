import { Fahrzeuggruppe } from 'types/reihung';
import Fahrzeug, { InheritedProps } from './Fahrzeug';
import React from 'react';
import withStyles, { WithStyles } from 'react-jss';

type OwnProps = InheritedProps & {
  gruppe: Fahrzeuggruppe;
  showDestination: boolean;
  showGruppenZugnummer: boolean;
  showFahrzeugGruppe: boolean;
  originalTrainNumber: string;
};
type Props = OwnProps & WithStyles<typeof styles>;

const Gruppe = ({
  gruppe,
  showDestination,
  showFahrzeugGruppe,
  showGruppenZugnummer,
  originalTrainNumber,
  classes,
  ...rest
}: Props) => {
  const gruppenPos = {
    left: `${(gruppe.startProzent - rest.correctLeft) * rest.scale}%`,
    width: `${(gruppe.endeProzent - gruppe.startProzent) * rest.scale}%`,
  };

  const nummerPos = {
    ...gruppenPos,
    bottom: showFahrzeugGruppe ? '2.5em' : '1.5em',
  };

  return (
    <>
      {gruppe.allFahrzeug.map(f => (
        <Fahrzeug
          {...rest}
          wrongWing={originalTrainNumber !== gruppe.verkehrlichezugnummer}
          destination={
            showDestination ? gruppe.zielbetriebsstellename : undefined
          }
          key={`${f.fahrzeugnummer}${f.positioningruppe}`}
          fahrzeug={f}
        />
      ))}
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

export const styles = {
  bezeichnung: {
    position: 'absolute',
    bottom: '1.5em',
    textAlign: 'center',
  },
};

export default React.memo(withStyles(styles)(Gruppe));
