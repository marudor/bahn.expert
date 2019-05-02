import { createStyles, withStyles, WithStyles } from '@material-ui/styles';
import { SubstituteRef } from 'types/abfahrten';
import React from 'react';

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

const styles = createStyles({
  main: {
    fontSize: '.7em',
  },
});

export default withStyles(styles)(Substitute);
