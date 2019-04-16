import { SubstituteRef } from 'types/abfahrten';
import React from 'react';
import withStyles, { WithStyles } from 'react-jss';

type OwnProps = {
  substitute: SubstituteRef;
};
type Props = OwnProps & WithStyles<typeof styles>;

const Substitute = ({ substitute, classes }: Props) => (
  <>
    <span className={classes.main}>Ersatzzug für</span>
    <span className={classes.main}>{substitute.train}</span>
  </>
);

const styles = {
  main: {
    fontSize: '.7em',
  },
};

export default React.memo(withStyles(styles)(Substitute));
