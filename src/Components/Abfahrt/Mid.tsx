import * as React from 'react';
import AbfahrtenService, { IAbfahrt } from '../../Services/AbfahrtenService';
import Via from './Via';
interface IProps {
  abfahrt: IAbfahrt;
  detail: boolean;
}

const Mid = ({ abfahrt, detail }: IProps) => (
  <div style={[style.mid, detail && style.detail]}>
    <Via abfahrt={abfahrt} detail={detail} />
    <div style={[style.destination, abfahrt.isCancelled && style.cancelled]}>
      {AbfahrtenService.normalizeName(abfahrt.destination)}
    </div>
  </div>
);

export default Mid;

const style: any = {
  detail: { whiteSpace: 'normal' },
  destination: { fontSize: '4em' },
  cancelled: { textDecoration: 'line-through' },
  mid: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    lineHeight: 1.2,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
};
