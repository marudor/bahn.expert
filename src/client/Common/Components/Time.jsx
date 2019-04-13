// @flow
/* eslint no-nested-ternary: 0 */
import { delayed, early } from 'style/mixins';
import { format, subMinutes } from 'date-fns';
import cc from 'classnames';
import React from 'react';
import withStyles, { type StyledProps } from 'react-jss';

type DispatchProps = {||};
type OwnProps = {|
  alignEnd?: boolean,
  className?: string,
  delay?: number,
  real?: number,
  showOriginalTime?: boolean,
  showZero?: boolean,
|};
type StateProps = {||};
type ReduxProps = {|
  ...DispatchProps,
  ...OwnProps,
  ...StateProps,
|};
type Props = StyledProps<ReduxProps, typeof styles>;

function delayString(delay?: number = 0) {
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
}: Props) => {
  if (!real) return <div />;
  const time = showOriginalTime && delay ? subMinutes(real, delay) : real;

  const hasDelay = showZero ? delay != null : Boolean(delay);

  const delayStyle = !hasDelay
    ? ''
    : // $FlowFixMe - hasDelay checked that delay is defined
    delay > 0
    ? classes.delayed
    : classes.early;

  return (
    <div
      className={cc(className, classes.time, {
        [delayStyle]: !showOriginalTime,
        [classes.alignEnd]: alignEnd,
      })}
    >
      <span>{format(time, 'HH:mm')}</span>
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
    flexDirection: 'column',
  },
  delayed,
  early,
};

export default withStyles<Props>(styles)(Time);
