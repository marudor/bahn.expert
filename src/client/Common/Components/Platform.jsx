// @flow
import { cancelled, delayed } from 'style/mixins';
import cc from 'classnames';
import React from 'react';
import withStyles, { type StyledProps } from 'react-jss';

type OwnProps = {|
  className?: string,
  cancelled?: boolean,
  scheduled?: string,
  real?: string,
|};
type Props = StyledProps<OwnProps, typeof styles>;

const Platform = ({ classes, className, cancelled, scheduled, real }) => (
  <span
    className={cc(className, {
      [classes.cancelled]: cancelled,
      [classes.delayed]: scheduled && scheduled !== real,
    })}
  >
    {real}
  </span>
);

const styles = {
  cancelled,
  delayed,
};

export default withStyles<Props>(styles)(Platform);
