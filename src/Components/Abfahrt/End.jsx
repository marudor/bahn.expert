// @flow
import { type Abfahrt } from 'types/abfahrten';
import cc from 'classcat';
import React from 'react';
import styles from './End.scss';
import Times from './Times';

type Props = {
  abfahrt: Abfahrt,
  detail: boolean,
};

function getDelay(abfahrt: Abfahrt) {
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
    <span className={numberDelay > 0 ? styles.delay : styles.early}>
      {'('}
      {delay}
      {')'}
    </span>
  );
}

const End = ({ abfahrt, detail }: Props) => (
  <div className={cc([styles.end, { [styles.cancelled]: abfahrt.isCancelled }])}>
    <Times abfahrt={abfahrt} detail={detail} />
    <div>
      {getDelay(abfahrt)}
      <span className={styles.platform}>{abfahrt.platform}</span>
    </div>
  </div>
);

export default End;
