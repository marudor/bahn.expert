/* eslint no-nested-ternary: 0 */
import { format, subMinutes } from 'date-fns';
import { makeStyles } from '@material-ui/core';
import { useCommonConfig } from 'client/Common/provider/CommonConfigProvider';
import clsx from 'clsx';
import type { FC } from 'react';

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
  real?: Date;
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

export const Time: FC<Props> = ({
  className,
  delay,
  real,
  showZero = true,
  alignEnd,
  oneLine,
  cancelled,
}) => {
  const classes = useStyles();
  const showOriginalTime = !useCommonConfig().time;

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
        },
      )}
    >
      <span className={clsx(oneLine && classes.oneLine)} data-testid="time">
        {format(time, 'HH:mm')}
      </span>
      {hasDelay && (
        <span
          className={clsx(
            hasDelay && (delay && delay > 0 ? classes.delayed : classes.early),
          )}
          data-testid="delay"
        >
          {delayString(delay as number)}
        </span>
      )}
    </div>
  );
};
