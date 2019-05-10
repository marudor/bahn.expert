/* eslint no-nested-ternary: 0 */
import { format, subMinutes } from 'date-fns';
import cc from 'classnames';
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

function delayString(delay: number = 0) {
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

  if (!real) return <div />;
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
        className={cc({
          [classes.spacing]: oneLine,
        })}
      >
        {format(time, 'HH:mm')}
      </span>
      <span className={cc(showOriginalTime && delayStyle)}>
        {hasDelay && delayString(delay)}
      </span>
    </div>
  );
};

export default Time;
