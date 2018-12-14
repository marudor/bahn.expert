// @flow
import './End.scss';
import { type Abfahrt } from 'types/abfahrten';
import cc from 'classnames';
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

type Props = {
  abfahrt: Abfahrt,
  detail: boolean,
};
const End = ({ abfahrt, detail }: Props) => (
  <div className="End">
    <Times abfahrt={abfahrt} detail={detail} />
    <div>
      {!detail && getDelay(abfahrt)}
      <span
        className={cc([
          'End__platform',
          {
            cancelled: abfahrt.isCancelled,
            'End__platform--different': abfahrt.scheduledPlatform && abfahrt.scheduledPlatform !== abfahrt.platform,
          },
        ])}
      >
        {abfahrt.platform}
      </span>
    </div>
  </div>
);

export default End;
