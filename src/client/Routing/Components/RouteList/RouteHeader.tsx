import Paper from '@material-ui/core/Paper';
import React from 'react';
import useStyles from './RouteHeader.style';

const RouteHeader = () => {
  const classes = useStyles();

  return (
    <Paper square className={classes.main}>
      <span>Ab</span>
      <span>An</span>
      <span>Dauer</span>
      <span>Umstiege</span>
    </Paper>
  );
};

export default RouteHeader;
