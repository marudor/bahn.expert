import { makeStyles } from '@material-ui/core';
import { Stop } from 'client/Common/Components/Details/Stop';
import type { Route$Stop } from 'types/routing';

const useStyles = makeStyles({
  wrap: {
    paddingLeft: '.2em',
  },
});
interface Props {
  stops?: Route$Stop[];
}

export const StopList = ({ stops }: Props) => {
  const classes = useStyles();

  return stops ? (
    <div className={classes.wrap}>
      {stops.map((s) => (
        <Stop key={s.station.id} stop={s} />
      ))}
    </div>
  ) : null;
};
