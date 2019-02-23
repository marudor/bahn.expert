// @flow
import './Gruppe.scss';
import Fahrzeug, { type InheritedProps } from './Fahrzeug';
import React from 'react';
import type { Fahrzeuggruppe } from 'types/reihung';

type Props = InheritedProps & {
  gruppe: Fahrzeuggruppe,
  showDestination: boolean,
  showFahrzeugGruppe: boolean,
};

const Gruppe = ({ gruppe, showDestination, showFahrzeugGruppe, ...rest }: Props) => {
  const gruppenPos = {
    left: `${(gruppe.startProzent - rest.correctLeft) * rest.scale}%`,
    width: `${(gruppe.endeProzent - gruppe.startProzent) * rest.scale}%`,
  };

  return (
    <>
      {gruppe.allFahrzeug.map(f => (
        <Fahrzeug
          {...rest}
          destination={showDestination ? gruppe.zielbetriebsstellename : null}
          key={`${f.fahrzeugnummer}${f.positioningruppe}`}
          fahrzeug={f}
        />
      ))}
      {showFahrzeugGruppe && (
        <span className="Gruppe__bezeichnung" style={gruppenPos}>
          {gruppe.fahrzeuggruppebezeichnung}
        </span>
      )}
    </>
  );
};

export default React.memo<Props>(Gruppe);
