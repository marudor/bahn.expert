// @flow
import React from 'react';
import styles from './Mid.styles';
import Via from './Via';
import withStyles, { type StyledProps } from 'react-jss';
import type { Abfahrt } from 'types/abfahrten';

export type OwnProps = {|
  abfahrt: Abfahrt,
  detail: boolean,
|};

type Props = StyledProps<OwnProps, typeof styles>;

const Mid = ({ abfahrt, detail, classes }: Props) => (
  <div className={classes.main}>
    <Via abfahrt={abfahrt} detail={detail} />
    <div className={classes.destination}>
      {abfahrt.isCancelled ? abfahrt.scheduledDestination : abfahrt.destination}
    </div>
  </div>
);

export default React.memo<OwnProps>(withStyles(styles)(Mid));
