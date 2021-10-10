import { makeStyles } from '@material-ui/core';
import { useMemo } from 'react';
import type { FC } from 'react';
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

export const Sektor: FC<Props> = ({ sektor, correctLeft, scale }) => {
  const classes = useStyles();
  const position = useMemo(() => {
    const { startprozent, endeprozent } = sektor.positionamgleis;
    const start = Number.parseFloat(startprozent);
    const end = Number.parseFloat(endeprozent);

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
