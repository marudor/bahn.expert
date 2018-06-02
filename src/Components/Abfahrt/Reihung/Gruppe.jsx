// @flow
import Fahrzeug from './Fahrzeug';
import React from 'react';
import type { Fahrzeuggruppe } from 'types/reihung';

type Props = {
  gruppe: Fahrzeuggruppe,
  showDestination: boolean,
};

export default class Gruppe extends React.PureComponent<Props> {
  render() {
    const { gruppe, showDestination } = this.props;

    return <div>{gruppe.allFahrzeug.map(f => <Fahrzeug destination={showDestination ? gruppe.zielbetriebsstellename : null} key={f.fahrzeugnummer} fahrzeug={f} />)}</div>;
  }
}
