/* eslint no-nested-ternary: 0 */
import { makeStyles } from '@material-ui/core';
import { Time } from 'client/Common/Components/Time';
import clsx from 'clsx';
import type { Abfahrt } from 'types/iris';

const useStyles = makeStyles((theme) => ({
  cancelled: theme.mixins.cancelled,
  timeWrapper: {
    display: 'flex',
    justifyContent: 'flex-end',
    '& > span': {
      color: theme.palette.text.primary,
      whiteSpace: 'pre-wrap',
    },
  },
}));

interface Props {
  abfahrt: Abfahrt;
  detail: boolean;
}

export const Times = ({
  abfahrt: { arrival, departure, cancelled },
  detail,
}: Props) => {
  const classes = useStyles();

  return (
    <div className={clsx(cancelled && classes.cancelled)}>
      {detail ? (
        <>
          {arrival && (
            <div
              className={clsx(
                classes.timeWrapper,
                arrival.cancelled && classes.cancelled
              )}
            >
              <span>{'An: '}</span>
              <Time alignEnd delay={arrival.delay} real={arrival.time} />
            </div>
          )}
          {departure && (
            <div
              className={clsx(
                classes.timeWrapper,
                departure.cancelled && classes.cancelled
              )}
            >
              <span>{'Ab: '}</span>
              <Time alignEnd delay={departure.delay} real={departure.time} />
            </div>
          )}
        </>
      ) : departure && (!departure.cancelled || cancelled) ? (
        <Time alignEnd delay={departure.delay} real={departure.time} />
      ) : (
        arrival && <Time alignEnd delay={arrival.delay} real={arrival.time} />
      )}
    </div>
  );
};
