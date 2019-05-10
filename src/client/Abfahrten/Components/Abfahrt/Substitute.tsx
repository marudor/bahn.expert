import { SubstituteRef } from 'types/abfahrten';
import React from 'react';
import useStyles from './Substitue.style';

type OwnProps = {
  substitute: SubstituteRef;
};
type Props = OwnProps;

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
