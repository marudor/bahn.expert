// @flow
import Fahrzeug from './Fahrzeug';
import React from 'react';
import type { Fahrzeuggruppe, FahrzeugType, SpecificType } from 'types/reihung';

type Props = {
  specificType: ?SpecificType,
  type: FahrzeugType,
  gruppe: Fahrzeuggruppe,
  showDestination: boolean,
};

export default class Gruppe extends React.PureComponent<Props> {
  render() {
    const { gruppe, showDestination, ...rest } = this.props;

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
      </div>
    );
  }
}
