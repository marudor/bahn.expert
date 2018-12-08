// @flow
import './Sektor.scss';
import React from 'react';
import type { Sektor } from 'types/reihung';

type Props = {
  sektor: Sektor,
  scale: number,
  correctLeft: number,
};

export default class SektorComp extends React.PureComponent<Props> {
  render() {
    const { sektor, scale, correctLeft } = this.props;

    const { startprozent, endeprozent } = sektor.positionamgleis;

    const start = Number.parseInt(startprozent, 10);
    const end = Number.parseInt(endeprozent, 10);

    const pos = {
      left: `${(start - correctLeft) * scale}%`,
      width: `${(end - start) * scale}%`,
    };

    return (
      <div className="Sektor" style={pos}>
        {sektor.sektorbezeichnung}
      </div>
    );
  }
}
