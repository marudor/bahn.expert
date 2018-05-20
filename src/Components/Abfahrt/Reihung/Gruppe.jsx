// @flow
import Fahrzeug from './Fahrzeug';
import React from 'react';
import type { Fahrzeuggruppe } from 'types/reihung';

type Props = {
  gruppe: Fahrzeuggruppe,
};

export default class Gruppe extends React.PureComponent<Props> {
  render() {
    const { gruppe } = this.props;

    return <div>{gruppe.allFahrzeug.map(f => <Fahrzeug key={f.fahrzeugnummer} fahrzeug={f} />)}</div>;
  }
}
