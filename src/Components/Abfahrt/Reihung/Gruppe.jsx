// @flow
import Fahrzeug from './Fahrzeug';
import React from 'react';
import type { Fahrzeuggruppe, FahrzeugType, SpecificType } from 'types/reihung';

type Props = {
  gruppe: Fahrzeuggruppe,
  showDestination: boolean,
  type: FahrzeugType,
  specificType: ?SpecificType,
};

export default class Gruppe extends React.PureComponent<Props> {
  render() {
    const { gruppe, showDestination, type, specificType } = this.props;

    return (
      <div>
        {gruppe.allFahrzeug.map(f => (
          <Fahrzeug
            specificType={specificType}
            type={type}
            destination={showDestination ? gruppe.zielbetriebsstellename : null}
            key={`${f.fahrzeugnummer}${f.positioningruppe}`}
            fahrzeug={f}
          />
        ))}
      </div>
    );
  }
}
