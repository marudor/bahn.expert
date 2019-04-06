// @flow
import ColumnStyles from './Column.styles';
import Paper from '@material-ui/core/Paper';
import React from 'react';
import withStyles, { type StyledProps } from 'react-jss';

type OwnProps = {||};
type Props = StyledProps<OwnProps, typeof styles>;

const RouteHeader = ({ classes }: Props) => (
  <Paper square className={classes.main}>
    <span className={classes.ab}>Ab</span>
    <span className={classes.an}>An</span>
    <span className={classes.dauer}>Dauer</span>
    <span className={classes.umstiege}>Umstiege</span>
  </Paper>
);

const styles = {
  main: {
    display: 'flex',
    marginBottom: '.2em',
  },
  ...ColumnStyles,
};

export default withStyles(styles)(RouteHeader);
