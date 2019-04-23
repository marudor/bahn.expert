import { createStyles, withStyles, WithStyles } from '@material-ui/styles';
import { gridStyle } from './Route';
import Paper from '@material-ui/core/Paper';
import React from 'react';

type Props = WithStyles<typeof styles>;

const RouteHeader = ({ classes }: Props) => (
  <Paper square className={classes.main}>
    <span>Ab</span>
    <span>An</span>
    <span>Dauer</span>
    <span>Umstiege</span>
  </Paper>
);

const styles = createStyles({
  main: {
    fontSize: '0.7em',
    ...gridStyle,
  },
});

export default withStyles(styles)(RouteHeader);
