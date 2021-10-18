import { makeStyles } from '@material-ui/core';
import { useMemo } from 'react';
import type { CoachSequenceSector } from 'types/coachSequence';
import type { FC } from 'react';

const useStyles = makeStyles({
  wrap: {
    position: 'absolute',
    fontWeight: 'bolder',
    textAlign: 'center',
  },
});

interface Props {
  sector: CoachSequenceSector;
  scale: number;
  correctLeft: number;
}

export const Sektor: FC<Props> = ({ sector, correctLeft, scale }) => {
  const classes = useStyles();
  const position = useMemo(() => {
    const { startPercent, endPercent } = sector.position;

    return {
      left: `${(startPercent - correctLeft) * scale}%`,
      width: `${(endPercent - startPercent) * scale}%`,
    };
  }, [correctLeft, scale, sector.position]);
  return (
    <div className={classes.wrap} style={position}>
      {sector.name}
    </div>
  );
};
