// @flow
import AbfahrtenService, { IAbfahrt } from '../../Services/AbfahrtenService';
import React from 'react';
import Via from './Via';
interface Props {
  abfahrt: IAbfahrt,
  detail: boolean,
}

const Mid = ({ abfahrt, detail }: Props) => (
  <div style={[style.mid, detail && style.detail]}>
    <Via abfahrt={abfahrt} detail={detail} />
    <div style={[style.destination, abfahrt.isCancelled && style.cancelled]}>
      {AbfahrtenService.normalizeName(abfahrt.destination)}
    </div>
  </div>
);

export default Mid;

const style = {
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
