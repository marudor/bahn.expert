import { makeStyles } from '@material-ui/core';
import type { SubstituteRef } from 'types/iris';

const useStyles = makeStyles({
  text: {
    fontSize: '.7em',
  },
});

interface Props {
  substitute: SubstituteRef;
}

export const Substitute = ({ substitute }: Props) => {
  const classes = useStyles();
  return (
    <>
      <span className={classes.text}>Ersatzzug für</span>
      <span className={classes.text}>{substitute.train}</span>
    </>
  );
};
