// @flow
import './Sektor.scss';
import React from 'react';
import type { Sektor } from 'types/reihung';

type Props = {
  sektor: Sektor,
};

export default class SektorComp extends React.PureComponent<Props> {
  render() {
    const { sektor } = this.props;

    const { startprozent, endeprozent } = sektor.positionamgleis;

    const start = Number.parseInt(startprozent, 10);
    const end = Number.parseInt(endeprozent, 10);

    const pos = {
      left: `${startprozent}%`,
      width: `${end - start}%`,
    };

    return (
      <div className="Sektor" style={pos}>
        {sektor.sektorbezeichnung}
      </div>
    );
  }
}
