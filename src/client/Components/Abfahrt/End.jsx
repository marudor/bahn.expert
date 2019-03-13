// @flow
import { type Abfahrt } from 'types/abfahrten';
import cc from 'classnames';
import React from 'react';
import styles from './End.styles';
import Times from './Times';
import withStyles, { type StyledProps } from 'react-jss';

function getDelay(abfahrt: Abfahrt, classes) {
  if ((!abfahrt.delayDeparture && !abfahrt.delayArrival) || abfahrt.isCancelled) {
    return null;
  }
  const numberDelay = abfahrt.delayDeparture || abfahrt.delayArrival || 0;
  let delay;

  if (numberDelay > 0) {
    delay = `+${numberDelay}`;
  } else {
    delay = `-${Math.abs(numberDelay)}`;
  }

  return (
    <span className={cc(classes.delay, numberDelay > 0 ? classes.delayed : classes.early)}>
      {'('}
      {delay}
      {')'}
    </span>
  );
}

type OwnProps = {|
  abfahrt: Abfahrt,
  detail: boolean,
|};
type Props = StyledProps<OwnProps, typeof styles>;
const End = ({ abfahrt, detail, classes }: Props) => (
  <div className={classes.main}>
    <Times abfahrt={abfahrt} detail={detail} />
    <div className={classes.bottom}>
      {!detail && getDelay(abfahrt, classes)}
      <span
        className={cc([
          classes.platform,
          {
            [classes.cancelled]: abfahrt.isCancelled,
            [classes.delayed]: abfahrt.scheduledPlatform && abfahrt.scheduledPlatform !== abfahrt.platform,
          },
        ])}
      >
        {abfahrt.platform}
      </span>
    </div>
  </div>
);

export default React.memo<OwnProps>(withStyles(styles)(End));
