// @flow
import Fahrzeug, { type InheritedProps } from './Fahrzeug';
import React from 'react';
import type { Fahrzeuggruppe } from 'types/reihung';

type Props = InheritedProps & {
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
