// @flow
import './End.scss';
import { type Abfahrt } from 'types/abfahrten';
import cc from 'classcat';
import React from 'react';
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
    <span className={numberDelay > 0 ? 'End--delay' : 'End--early'}>
      {'('}
      {delay}
      {')'}
    </span>
  );
}

const End = ({ abfahrt, detail }: Props) => (
  <div className={cc(['End', { cancelled: abfahrt.isCancelled }])}>
    <Times abfahrt={abfahrt} detail={detail} />
    <div>
      {getDelay(abfahrt)}
      <span className={'End__platform'}>{abfahrt.platform}</span>
    </div>
  </div>
);

export default End;
