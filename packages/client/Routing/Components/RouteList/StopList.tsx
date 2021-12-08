import { makeStyles } from '@material-ui/core';
import { Stop } from 'client/Common/Components/Details/Stop';
import type { FC } from 'react';
import type { ParsedProduct } from 'types/HAFAS';
import type { Route$Stop } from 'types/routing';

const useStyles = makeStyles({
  wrap: {
    paddingLeft: '.2em',
  },
});
interface Props {
  stops?: Route$Stop[];
  product?: ParsedProduct;
}

export const StopList: FC<Props> = ({ stops, product }) => {
  const classes = useStyles();

  return stops ? (
    <div className={classes.wrap}>
      {stops.map((s, i) => (
        <Stop
          doNotRenderOccupancy
          key={s.station.id}
          stop={s}
          showWR={i === 0 ? product : undefined}
        />
      ))}
    </div>
  ) : null;
};
