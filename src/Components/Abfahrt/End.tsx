import * as React from 'react';
import { IAbfahrt } from '../../Services/AbfahrtenService';
import Times from './Times';

interface IProps {
  abfahrt: IAbfahrt;
  detail: boolean;
}

function getDelay(abfahrt: IAbfahrt) {
  if ((!abfahrt.delayDeparture && !abfahrt.delayArrival) || abfahrt.isCancelled) {
    return null;
  }
  let delay: number | string = abfahrt.delayDeparture || abfahrt.delayArrival;
  if ((abfahrt.delayDeparture || abfahrt.delayArrival) > 0) {
    delay = `+${delay}`;
  } else {
    delay = `-${Math.abs(delay)}`;
  }
  return (
    <span
      style={
        (abfahrt.delayDeparture || abfahrt.delayArrival) > 0
          ? style.delay
          : style.early
      }
    >
      ({delay})
    </span>
  );
}

const End = ({ abfahrt, detail }: IProps) => (
  <div style={[style.end, abfahrt.isCancelled && style.cancelled]}>
    <Times abfahrt={abfahrt} detail={detail} />
    <div>
      {getDelay(abfahrt)}
      <span style={style.platform}>{abfahrt.platform}</span>
    </div>
  </div>
);

export default End;

const style: any = {
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
