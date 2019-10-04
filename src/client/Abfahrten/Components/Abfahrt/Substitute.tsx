import { SubstituteRef } from 'types/api/iris';
import React from 'react';
import useStyles from './Substitue.style';

type Props = {
  substitute: SubstituteRef;
};

const Substitute = ({ substitute }: Props) => {
  const classes = useStyles();

  return (
    <>
      <span className={classes.main}>Ersatzzug für</span>
      <span className={classes.main}>{substitute.train}</span>
    </>
  );
};

export default Substitute;
