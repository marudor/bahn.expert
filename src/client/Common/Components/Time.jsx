// @flow
import { delayed, early } from 'style/mixins';
import { delayString, delayStyle } from 'client/util/delay';
import { format } from 'date-fns';
import cc from 'classnames';
import React from 'react';
import withStyles, { type StyledProps } from 'react-jss';

type DispatchProps = {||};
type OwnProps = {|
  delay: number,
  real: number,
  className?: string,
|};
type StateProps = {||};
type ReduxProps = {|
  ...DispatchProps,
  ...OwnProps,
  ...StateProps,
|};
type Props = StyledProps<ReduxProps, typeof styles>;

const Time = ({ classes, className, delay, real }: Props) => (
  <div className={cc(className, delayStyle(classes, delay))}>
    <span>{format(real, 'HH:mm')}</span>
    {Boolean(delay) && `(${delayString(delay)})`}
  </div>
);

const styles = {
  delayed,
  early,
};

export default withStyles(styles)(Time);
