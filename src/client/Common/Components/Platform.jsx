// @flow
import { cancelled, delayed } from 'style/mixins';
import cc from 'classnames';
import React from 'react';
import withStyles, { type StyledProps } from 'react-jss';

type OwnProps = {|
  cancelled?: boolean,
  scheduled?: string,
  real: string,
|};
type Props = StyledProps<OwnProps, typeof styles>;

const Platform = ({ classes, cancelled, scheduled, real }) => (
  <span
    className={cc({
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
