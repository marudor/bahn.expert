// @flow
import { type Abfahrt } from 'types/abfahrten';
import cc from 'classnames';
import React from 'react';
import styles from './End.styles';
import Times from './Times';
import withStyles, { type StyledProps } from 'react-jss';

type OwnProps = {|
  abfahrt: Abfahrt,
  detail: boolean,
|};
type Props = StyledProps<OwnProps, typeof styles>;
const End = ({ abfahrt, detail, classes }: Props) => (
  <div className={classes.main}>
    <Times abfahrt={abfahrt} detail={detail} />
    <span
      className={cc({
        [classes.cancelled]: abfahrt.isCancelled,
        [classes.delayed]: abfahrt.scheduledPlatform && abfahrt.scheduledPlatform !== abfahrt.platform,
      })}
    >
      {abfahrt.platform}
    </span>
  </div>
);

export default React.memo<OwnProps>(withStyles(styles)(End));
