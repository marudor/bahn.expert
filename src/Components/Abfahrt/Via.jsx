// @flow
import { type Abfahrt } from 'types/abfahrten';
import { normalizeName } from 'util';
import cc from 'classcat';
import React from 'react';
import styles from './Via.scss';

type Props = {
  abfahrt: Abfahrt,
  detail: boolean,
};

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
    <div key="i" className={styles.info}>
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
        [styles.cancelled]: isCancelled,
        [styles.additional]: isAdditional,
        [styles.hbf]: isHbf,
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

const Via = ({ abfahrt, detail }: Props) => {
  const info = getInfo(abfahrt);
  const via = detail ? getDetailedVia(abfahrt) : getNormalVia(abfahrt);

  return (
    <div className={cc([styles.via, { [styles.cancelled]: abfahrt.isCancelled }])}>
      {info}
      {(detail || !info) && via}
    </div>
  );
};

export default Via;
