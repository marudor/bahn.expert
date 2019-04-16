import { gridStyle } from './Route';
import Paper from '@material-ui/core/Paper';
import React from 'react';
import withStyles, { WithStyles } from 'react-jss';

type Props = WithStyles<typeof styles>;

const RouteHeader = ({ classes }: Props) => (
  <Paper square className={classes.main}>
    <span>Ab</span>
    <span>An</span>
    <span>Dauer</span>
    <span>Umstiege</span>
  </Paper>
);

const styles = {
  main: {
    fontSize: '0.7em',
    ...gridStyle,
  },
};

export default withStyles(styles)(RouteHeader);
