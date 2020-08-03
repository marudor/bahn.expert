import { makeStyles } from '@material-ui/core';
import { useMemo } from 'react';
import type { Sektor as SektorType } from 'types/reihung';

const useStyles = makeStyles({
  wrap: {
    position: 'absolute',
    fontWeight: 'bolder',
    textAlign: 'center',
  },
});

interface Props {
  sektor: SektorType;
  scale: number;
  correctLeft: number;
}

export const Sektor = ({ sektor, correctLeft, scale }: Props) => {
  const classes = useStyles();
  const position = useMemo(() => {
    const { startprozent, endeprozent } = sektor.positionamgleis;
    const start = Number.parseInt(startprozent, 10);
    const end = Number.parseInt(endeprozent, 10);

    return {
      left: `${(start - correctLeft) * scale}%`,
      width: `${(end - start) * scale}%`,
    };
  }, [sektor, correctLeft, scale]);
  return (
    <div className={classes.wrap} style={position}>
      {sektor.sektorbezeichnung}
    </div>
  );
};
