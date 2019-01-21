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

export default class Gruppe extends React.PureComponent<Props> {
  render() {
    const { gruppe, showDestination, showFahrzeugGruppe, ...rest } = this.props;

    const gruppenPos = {
      left: `${(gruppe.startProzent - rest.correctLeft) * rest.scale}%`,
      width: `${(gruppe.endeProzent - gruppe.startProzent) * rest.scale}%`,
    };

    return (
      <div>
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
      </div>
    );
  }
}
