import { cancelled, delayed } from 'style/mixins';
import cc from 'classnames';
import React from 'react';
import withStyles, { WithStyles } from 'react-jss';

type OwnProps = {
  className?: string;
  cancelled?: boolean;
  scheduled?: string;
  real?: string;
};
type Props = OwnProps & WithStyles<typeof styles>;

const Platform = ({
  classes,
  className,
  cancelled,
  scheduled,
  real,
}: Props) => (
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

export default withStyles(styles)(Platform);
