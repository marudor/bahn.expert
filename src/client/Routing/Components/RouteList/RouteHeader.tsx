import Chip from '@material-ui/core/Chip';
import { format } from 'date-fns';
import Paper from '@material-ui/core/Paper';
import React from 'react';
import useStyles from './RouteHeader.style';

interface Props {
  date: number;
}
const RouteHeader = ({ date }: Props) => {
  const classes = useStyles();

  return (
    <Paper square className={classes.main}>
      <span data-testid="headerDate" className={classes.date}>
        {/* {format(date, 'dd.MM.yyyy')} */}
        <Chip
          size="medium"
          variant="outlined"
          color="secondary"
          className={classes.chip}
          label={format(date, 'dd.MM.yyyy')}
        />
      </span>
      <span>Ab</span>
      <span>An</span>
      <span>Dauer</span>
      <span>Umstiege</span>
    </Paper>
  );
};

export default RouteHeader;
