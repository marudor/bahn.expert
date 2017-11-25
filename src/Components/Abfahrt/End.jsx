// @flow
import { type IAbfahrt } from '../../Services/AbfahrtenService';
import React from 'react';
import Times from './Times';

type Props = {
  abfahrt: IAbfahrt,
  detail: boolean,
};

function getDelay(abfahrt: IAbfahrt) {
  if ((!abfahrt.delayDeparture && !abfahrt.delayArrival) || abfahrt.isCancelled) {
    return null;
  }
  const numberDelay = abfahrt.delayDeparture || abfahrt.delayArrival;
  let delay;

  if ((abfahrt.delayDeparture || abfahrt.delayArrival) > 0) {
    delay = `+${numberDelay}`;
  } else {
    delay = `-${Math.abs(numberDelay)}`;
  }

  return (
    <span style={(abfahrt.delayDeparture || abfahrt.delayArrival) > 0 ? style.delay : style.early}>
      {'('}
      {delay}
      {')'}
    </span>
  );
}

const End = ({ abfahrt, detail }: Props) => (
  <div style={[style.end, abfahrt.isCancelled && style.cancelled]}>
    <Times abfahrt={abfahrt} detail={detail} />
    <div>
      {getDelay(abfahrt)}
      <span style={style.platform}>{abfahrt.platform}</span>
    </div>
  </div>
);

export default End;

const style = {
  end: {
    alignItems: 'flex-end',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginLeft: 15,
  },
  cancelled: { textDecoration: 'line-through' },
  platform: { fontSize: '3em' },
  early: { color: 'green', fontSize: '3em', marginRight: '0.4em' },
  delay: { color: 'red', fontSize: '3em', marginRight: '0.4em' },
};
