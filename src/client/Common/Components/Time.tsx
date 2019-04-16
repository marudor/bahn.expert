/* eslint no-nested-ternary: 0 */
import { delayed, early } from 'style/mixins';
import { format, subMinutes } from 'date-fns';
import cc from 'classnames';
import React from 'react';
import withStyles, { WithStyles } from 'react-jss';

type OwnProps = {
  alignEnd?: boolean;
  className?: string;
  delay?: number;
  real?: number;
  showOriginalTime?: boolean;
  showZero?: boolean;
  oneLine?: boolean;
};

type Props = OwnProps & WithStyles<typeof styles>;

function delayString(delay: number = 0) {
  if (delay < 0) {
    return `-${Math.abs(delay)}`;
  }

  return `+${delay}`;
}

const Time = ({
  classes,
  className,
  delay,
  real,
  showOriginalTime,
  showZero = true,
  alignEnd,
  oneLine,
}: Props) => {
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

const styles = {
  alignEnd: {
    alignItems: 'flex-end',
  },
  time: {
    display: 'flex',
  },
  seperateLine: {
    flexDirection: 'column',
  },
  spacing: {
    marginRight: '.2em',
  },
  delayed,
  early,
};

export default withStyles(styles)(Time);
