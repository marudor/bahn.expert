// @flow
import './Gruppe.scss';
import Fahrzeug, { type InheritedProps } from './Fahrzeug';
import React from 'react';
import type { Fahrzeuggruppe } from 'types/reihung';

type Props = InheritedProps & {
  gruppe: Fahrzeuggruppe,
  showDestination: boolean,
  showGruppenZugnummer: boolean,
  showFahrzeugGruppe: boolean,
};

const Gruppe = ({ gruppe, showDestination, showFahrzeugGruppe, showGruppenZugnummer, ...rest }: Props) => {
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
          destination={showDestination ? gruppe.zielbetriebsstellename : null}
          key={`${f.fahrzeugnummer}${f.positioningruppe}`}
          fahrzeug={f}
        />
      ))}
      {showGruppenZugnummer && gruppe.verkehrlichezugnummer && (
        <span className="Gruppe__bezeichnung" style={nummerPos}>
          {rest.type} {gruppe.verkehrlichezugnummer}
        </span>
      )}
      {showFahrzeugGruppe && (
        <span className="Gruppe__bezeichnung" style={gruppenPos}>
          {gruppe.fahrzeuggruppebezeichnung}
        </span>
      )}
    </>
  );
};

export default React.memo<Props>(Gruppe);
