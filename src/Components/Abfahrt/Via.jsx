// @flow
import './Via.scss';
import { type Abfahrt } from 'types/abfahrten';
import { normalizeName } from 'util';
import AbfahrtContext from './AbfahrtContext';
import cc from 'classcat';
import React from 'react';

function getInfo(abfahrt: Abfahrt, detail: boolean) {
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
  for (let i = 1; i < abfahrt.messages.delay.length; i += 1) {
    info += ` +++ ${abfahrt.messages.delay[i].text}`;
  }

  return info ? (
    <div
      key="i"
      className={cc([
        'Via__info',
        {
          'Via--detail': detail,
        },
      ])}
    >
      {info}
    </div>
  ) : null;
}

function getAbfahrt(
  name: string,
  index: number,
  length: number,
  abfahrt: Abfahrt,
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
      className={cc({
        cancelled: isCancelled,
        'Via--additional': isAdditional,
        'Via--hbf': isHbf,
      })}
    >
      {normalizeName(name)}
    </span>
  );
  if (index + 1 !== length) {
    via.push(<span key={index}>{' - '}</span>);
  }

  return via;
}

function getNormalVia(abfahrt: Abfahrt) {
  let via = [];
  const abfahrten = abfahrt.via;

  abfahrten.forEach((v, index) => {
    via = via.concat(getAbfahrt(v, index, abfahrten.length, abfahrt, abfahrt.isCancelled));
  });

  return via;
}

function getDetailedVia(abfahrt: Abfahrt) {
  let via = [];
  const abfahrten = abfahrt.route;

  abfahrten.forEach((v, index) => {
    via = via.concat(
      getAbfahrt(v.name, index, abfahrten.length, abfahrt, v.isCancelled || abfahrt.isCancelled, v.isAdditional)
    );
  });

  return via;
}

const Via = () => (
  <AbfahrtContext.Consumer>
    {({ abfahrt, detail }) => {
      const info = getInfo(abfahrt, detail);
      const via = detail ? getDetailedVia(abfahrt) : getNormalVia(abfahrt);

      return (
        <div className={cc(['Via', { cancelled: abfahrt.isCancelled }])}>
          {info}
          {(detail || !info) && via}
        </div>
      );
    }}
  </AbfahrtContext.Consumer>
);

export default Via;
