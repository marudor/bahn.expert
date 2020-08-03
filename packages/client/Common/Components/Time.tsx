/* eslint no-nested-ternary: 0 */
import { CommonConfigContainer } from 'client/Common/container/CommonConfigContainer';
import { format, subMinutes } from 'date-fns';
import { makeStyles } from '@material-ui/core';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
  delayed: theme.mixins.delayed,
  early: theme.mixins.early,
  cancelled: theme.mixins.cancelled,
  wrap: {
    display: 'flex',
  },
  alignEnd: {
    alignItems: 'flex-end',
  },
  multiLineWrap: {
    flexDirection: 'column',
  },
  oneLine: {
    marginRight: '.2em',
  },
}));

interface Props {
  alignEnd?: boolean;
  className?: string;
  delay?: number;
  real?: number;
  showZero?: boolean;
  oneLine?: boolean;
  cancelled?: boolean;
}

function delayString(delay: number) {
  if (delay < 0) {
    return `-${Math.abs(delay)}`;
  }

  return `+${delay}`;
}

export const Time = ({
  className,
  delay,
  real,
  showZero = true,
  alignEnd,
  oneLine,
  cancelled,
}: Props) => {
  const classes = useStyles();
  const showOriginalTime = !CommonConfigContainer.useContainer().config.time;

  if (!real) return null;
  const time = showOriginalTime && delay ? subMinutes(real, delay) : real;

  const hasDelay = showZero ? delay != null : Boolean(delay);

  return (
    <div
      className={clsx(
        className,
        classes.wrap,
        !showOriginalTime &&
          hasDelay &&
          (delay && delay > 0 ? classes.delayed : classes.early),
        {
          [classes.alignEnd]: alignEnd,
          [classes.multiLineWrap]: !oneLine,
          [classes.cancelled]: cancelled,
        }
      )}
    >
      <span className={clsx(oneLine && classes.oneLine)} data-testid="time">
        {format(time, 'HH:mm')}
      </span>
      {hasDelay && (
        <span
          className={clsx(
            hasDelay && (delay && delay > 0 ? classes.delayed : classes.early)
          )}
          data-testid="delay"
        >
          {delayString(delay as number)}
        </span>
      )}
    </div>
  );
};
