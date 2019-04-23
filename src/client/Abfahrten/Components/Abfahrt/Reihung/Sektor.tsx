import { createStyles, withStyles, WithStyles } from '@material-ui/styles';
import { Sektor } from 'types/reihung';
import React from 'react';

type OwnProps = {
  sektor: Sektor;
  scale: number;
  correctLeft: number;
};

type Props = OwnProps & WithStyles<typeof styles>;

const SektorComp = ({ sektor, scale, correctLeft, classes }: Props) => {
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

const styles = createStyles({
  main: {
    position: 'absolute',
    fontWeight: 'bolder',
    textAlign: 'center',
  },
});

export default React.memo(withStyles(styles)(SektorComp));
