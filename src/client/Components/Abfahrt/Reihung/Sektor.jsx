// @flow
import cc from 'classnames';
import React from 'react';
import withStyles, { type StyledProps } from 'react-jss';
import type { Sektor } from 'types/reihung';

type OwnProps = {|
  sektor: Sektor,
  scale: number,
  correctLeft: number,
|};

type Props = StyledProps<OwnProps, typeof styles>;

const SektorComp = ({ sektor, scale, correctLeft, classes }: Props) => {
  const { startprozent, endeprozent } = sektor.positionamgleis;

  const start = Number.parseInt(startprozent, 10);
  const end = Number.parseInt(endeprozent, 10);

  const pos = {
    left: `${(start - correctLeft) * scale}%`,
    width: `${(end - start) * scale}%`,
  };

  return (
    <div className={cc(classes.main, classes.position)} style={pos}>
      {sektor.sektorbezeichnung}
    </div>
  );
};

const styles = {
  main: {
    position: 'absolute',
    fontWeight: 'bolder',
    textAlign: 'center',
  },
  position: ({ sektor, scale, correctLeft }: OwnProps) => {
    const { startprozent, endeprozent } = sektor.positionamgleis;

    const start = Number.parseInt(startprozent, 10);
    const end = Number.parseInt(endeprozent, 10);

    return {
      left: `${(start - correctLeft) * scale}%`,
      width: `${(end - start) * scale}%`,
    };
  },
};

export default React.memo<OwnProps>(withStyles(styles)(SektorComp));
