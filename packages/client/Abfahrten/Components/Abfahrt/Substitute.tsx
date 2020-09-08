import { makeStyles } from '@material-ui/core';
import type { FC } from 'react';
import type { SubstituteRef } from 'types/iris';

const useStyles = makeStyles({
  text: {
    fontSize: '.7em',
  },
});

interface Props {
  substitute: SubstituteRef;
}

export const Substitute: FC<Props> = ({ substitute }) => {
  const classes = useStyles();
  return (
    <>
      <span className={classes.text}>Ersatzzug für</span>
      <span className={classes.text}>{substitute.train}</span>
    </>
  );
};
