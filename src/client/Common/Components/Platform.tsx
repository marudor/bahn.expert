import { createStyles, withStyles, WithStyles } from '@material-ui/styles';
import cc from 'classnames';
import React from 'react';

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

const styles = createStyles(theme => ({
  cancelled: theme.mixins.cancelled,
  delayed: theme.mixins.delayed,
}));

export default withStyles(styles, { withTheme: true })(Platform);
