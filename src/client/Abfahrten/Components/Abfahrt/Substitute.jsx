// @flow
import React from 'react';
import withStyles, { type StyledProps } from 'react-jss';
import type { SubstituteRef } from 'types/abfahrten';

type OwnProps = {|
  substitute: SubstituteRef,
|};
type Props = StyledProps<OwnProps, typeof styles>;

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

export default React.memo<OwnProps>(withStyles<Props>(styles)(Substitute));
