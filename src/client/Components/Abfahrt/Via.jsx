// @flow
import './Via.scss';
import { type Abfahrt } from 'types/abfahrten';
import { format, isBefore } from 'date-fns';
import { normalizeName } from 'client/util';
import AbfahrtContext from './AbfahrtContext';
import cc from 'classnames';
import React from 'react';

function getDetailedInfo(abfahrt: Abfahrt) {
  const messages = [...abfahrt.messages.delay, ...abfahrt.messages.qos];

  if (messages.length) {
    const sorted = messages.sort((a, b) => (isBefore(a.timestamp, b.timestamp) ? 1 : -1));

    return (
      <div key="i" className="Via__info">
        {sorted.map(m => (
          <div key={m.timestamp}>
            {format(m.timestamp, 'HH:mm')}: {m.text}
          </div>
        ))}
      </div>
    );
  }

  return null;
}

function getInfo(abfahrt: Abfahrt) {
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
    <div key="i" className="Via__info">
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
      const info = detail ? getDetailedInfo(abfahrt) : getInfo(abfahrt);
      const via = detail ? getDetailedVia(abfahrt) : getNormalVia(abfahrt);

      return (
        <div className={cc(['Via', { detail, cancelled: abfahrt.isCancelled }])}>
          {info}
          {(detail || !info) && via}
        </div>
      );
    }}
  </AbfahrtContext.Consumer>
);

export default Via;
