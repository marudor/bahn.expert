import { Sektor } from 'types/reihung';
import React from 'react';
import useStyles from './Sektor.style';

type OwnProps = {
  sektor: Sektor;
  scale: number;
  correctLeft: number;
};

type Props = OwnProps;

const SektorComp = ({ sektor, scale, correctLeft }: Props) => {
  const classes = useStyles();
  const { startprozent, endeprozent } = sektor.positionamgleis;

  const start = Number.parseInt(startprozent, 10);
  const end = Number.parseInt(endeprozent, 10);

  const pos = {
    left: `${(start - correctLeft) * scale}%`,
    width: `${(end - start) * scale}%`,
  };

  return (
    <div className={classes.main} style={pos}>
      {sektor.sektorbezeichnung}
    </div>
  );
};

export default SektorComp;
