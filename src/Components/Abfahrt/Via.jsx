// @flow
import AbfahrtenService, { IAbfahrt } from '../../Services/AbfahrtenService';
import React from 'react';

interface Props {
  abfahrt: IAbfahrt,
  detail: boolean,
}

function getInfo(abfahrt: IAbfahrt) {
  let info = '';
  if (abfahrt.messages.delay.length > 0) {
    info += abfahrt.messages.delay[0].text;
  }
  abfahrt.messages.qos.forEach(q => {
    if (info.length > 0) {
      info += ' +++ ';
    }
    info += q.text;
  });
  for (let i = 1; i < abfahrt.messages.delay.length; i++) {
    info += ` +++ ${abfahrt.messages.delay[i].text}`;
  }
  return info
    ? <div key="i" style={style.info}>
        {info}
      </div>
    : null;
}

function getAbfahrt(
  name: string,
  index: number,
  length: number,
  abfahrt: IAbfahrt,
  isCancelled?: number,
  isAdditional?: number
) {
  const via = [];
  const lowerName = name.toLowerCase();
  const isHbf =
    lowerName.includes('hbf') ||
    lowerName.includes('centraal') ||
    lowerName.includes('centrale') ||
    lowerName.includes('termini');
  via.push(
    <span
      key={`${index}i`}
      style={[isCancelled && style.cancelled, isAdditional && style.additional, isHbf && style.hbf]}>
      {AbfahrtenService.normalizeName(name)}
    </span>
  );
  if (index + 1 !== length) {
    via.push(
      <span key={index}>
        {' - '}
      </span>
    );
  }
  return via;
}

function getNormalVia(abfahrt: IAbfahrt) {
  let via = [];
  const abfahrten = abfahrt.via;
  abfahrten.forEach((v, index) => {
    via = via.concat(getAbfahrt(v, index, abfahrten.length, abfahrt, abfahrt.isCancelled));
  });
  return via;
}

function getDetailedVia(abfahrt: IAbfahrt) {
  let via = [];
  const abfahrten = abfahrt.route;
  abfahrten.forEach((v, index) => {
    via = via.concat(
      getAbfahrt(v.name, index, abfahrten.length, abfahrt, v.isCancelled || abfahrt.isCancelled, v.isAdditional)
    );
  });
  return via;
}

const Via = ({ abfahrt, detail }: Props) => {
  const info = getInfo(abfahrt);
  const via = detail ? getDetailedVia(abfahrt) : getNormalVia(abfahrt);
  return (
    <div style={[style.via, abfahrt.isCancelled && style.cancelled]}>
      {info}
      {(detail || !info) && via}
    </div>
  );
};
export default Via;

const style = {
  info: {
    textDecoration: 'none',
    color: 'red',
    overflow: 'hidden',
  },
  cancelled: { textDecoration: 'line-through' },
  via: {
    fontSize: '2.1em',
    lineHeight: 1.2,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  additional: { color: 'red' },
  hbf: { fontWeight: 'bold' },
};
