// @flow
import './Sektor.scss';
import React from 'react';
import type { Sektor } from 'types/reihung';

type Props = {
  sektor: Sektor,
  scale: number,
};

export default class SektorComp extends React.PureComponent<Props> {
  render() {
    const { sektor, scale } = this.props;

    const { startprozent, endeprozent } = sektor.positionamgleis;

    const start = Number.parseInt(startprozent, 10) * scale;
    const end = Number.parseInt(endeprozent, 10) * scale;

    const pos = {
      left: `${start}%`,
      width: `${end - start}%`,
    };

    return (
      <div className="Sektor" style={pos}>
        {sektor.sektorbezeichnung}
      </div>
    );
  }
}
