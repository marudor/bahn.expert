// @flow
import { gridStyle } from './Route';
import Paper from '@material-ui/core/Paper';
import React from 'react';
import withStyles, { type StyledProps } from 'react-jss';

type OwnProps = {||};
type Props = StyledProps<OwnProps, typeof styles>;

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

export default withStyles<Props>(styles)(RouteHeader);
