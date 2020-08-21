import { Info } from './Info';
import { makeStyles } from '@material-ui/core';
import { useAbfahrt } from 'client/Abfahrten/Components/Abfahrt/BaseAbfahrt';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
  destination: {
    fontSize: '4em',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  cancelled: theme.mixins.cancelled,
  different: theme.mixins.changed,
  wrap: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'space-around',
    overflow: 'hidden',
  },
  noDetail: {
    whiteSpace: 'nowrap',
  },
}));

export const Mid = () => {
  const { abfahrt, detail } = useAbfahrt();
  const classes = useStyles();
  return (
    <div
      className={clsx(classes.wrap, !detail && classes.noDetail)}
      data-testid="abfahrtMid"
    >
      <Info />
      <div
        data-testid="destination"
        className={clsx(classes.destination, {
          [classes.cancelled]: abfahrt.cancelled,
          [classes.different]:
            !abfahrt.cancelled &&
            abfahrt.destination !== abfahrt.scheduledDestination,
        })}
      >
        {abfahrt.cancelled ? abfahrt.scheduledDestination : abfahrt.destination}
      </div>
    </div>
  );
};
