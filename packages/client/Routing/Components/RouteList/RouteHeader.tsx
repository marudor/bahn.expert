import { Chip, makeStyles, Paper } from '@material-ui/core';
import { format } from 'date-fns';
import type { FC } from 'react';

const useStyles = makeStyles({
  wrap: {
    gridTemplateColumns: '2fr 2fr 2fr 2fr',
    gridTemplateRows: '60px 20px',
    display: 'grid',
    marginBottom: '.2em',
    alignItems: 'center',
    fontSize: '.8em',
  },
  date: {
    gridArea: '1 / 1 / 2 / 5',
    textAlign: 'center',
    marginBottom: 10,
  },
  chip: {
    fontSize: '1.4rem',
  },
});

interface Props {
  date: number;
}

export const RouteHeader: FC<Props> = ({ date }) => {
  const classes = useStyles();

  return (
    <Paper className={classes.wrap} square>
      <span className={classes.date} data-testid="headerDate">
        <Chip
          className={classes.chip}
          size="medium"
          variant="outlined"
          color="secondary"
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
