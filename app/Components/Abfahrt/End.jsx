// @flow
import './End.scss';
import { type Abfahrt } from 'types/abfahrten';
import AbfahrtContext from './AbfahrtContext';
import cc from 'classcat';
import React from 'react';
import Times from './Times';

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

const End = () => (
  <AbfahrtContext.Consumer>
    {({ abfahrt, detail }) => (
      <div className="End">
        <Times />
        <div>
          {!detail && getDelay(abfahrt)}
          <span className={cc(['End__platform', { cancelled: abfahrt.isCancelled }])}>{abfahrt.platform}</span>
        </div>
      </div>
    )}
  </AbfahrtContext.Consumer>
);

export default End;
