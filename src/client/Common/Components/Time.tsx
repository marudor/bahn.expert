/* eslint no-nested-ternary: 0 */
import { format, subMinutes } from 'date-fns';
import cc from 'clsx';
import React from 'react';
import useStyles from './Time.style';

type OwnProps = {
  alignEnd?: boolean;
  className?: string;
  delay?: number;
  real?: number;
  showOriginalTime?: boolean;
  showZero?: boolean;
  oneLine?: boolean;
  cancelled?: boolean;
};

type Props = OwnProps;

function delayString(delay: number) {
  if (delay < 0) {
    return `-${Math.abs(delay)}`;
  }

  return `+${delay}`;
}

const Time = ({
  className,
  delay,
  real,
  showOriginalTime,
  showZero = true,
  alignEnd,
  oneLine,
  cancelled,
}: Props) => {
  const classes = useStyles();

  if (!real) return null;
  const time = showOriginalTime && delay ? subMinutes(real, delay) : real;

  const hasDelay = showZero ? delay != null : Boolean(delay);

  const delayStyle = !hasDelay
    ? ''
    : delay && delay > 0
    ? classes.delayed
    : classes.early;

  return (
    <div
      className={cc(className, classes.time, {
        [delayStyle]: !showOriginalTime,
        [classes.alignEnd]: alignEnd,
        [classes.seperateLine]: !oneLine,
        [classes.cancelled]: cancelled,
      })}
    >
      <span
        data-testid="time"
        className={cc({
          [classes.spacing]: oneLine,
        })}
      >
        {format(time, 'HH:mm')}
      </span>
      {hasDelay && (
        <span
          data-testid="delay"
          className={cc(showOriginalTime && delayStyle)}
        >
          {delayString(delay as number)}
        </span>
      )}
    </div>
  );
};

export default Time;
