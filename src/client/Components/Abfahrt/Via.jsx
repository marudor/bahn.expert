// @flow
import './Via.scss';
import { type Abfahrt } from 'types/abfahrten';
import { compareDesc, format } from 'date-fns';
import { connect } from 'react-redux';
import cc from 'classnames';
import React from 'react';
import type { AppState } from 'AppState';

function getDetailedInfo(abfahrt: Abfahrt, showSupersededMessages: boolean) {
  let messages = [...abfahrt.messages.delay, ...abfahrt.messages.qos];

  if (!showSupersededMessages) {
    messages = messages.filter(m => !m.superseded);
  }

  if (messages.length) {
    const sorted = messages.sort((a, b) => compareDesc(a.timestamp, b.timestamp));

    return (
      <div key="i" className={cc('Via__info', { cancelled: abfahrt.isCancelled })}>
        {sorted.map((m, i) => (
          <div
            key={i}
            className={cc({
              cancelled: m.superseded,
            })}
          >
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
  abfahrt.messages.qos
    .filter(m => !m.superseded)
    .forEach(q => {
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
      className={cc('Via__info', {
        cancelled: abfahrt.isCancelled,
      })}
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
      {name}
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

  let cancelled = abfahrt.isCancelled;

  abfahrten.forEach((v, index) => {
    if (v.isCancelled || v.isAdditional) {
      cancelled = false;
    }
    via = via.concat(getAbfahrt(v.name, index, abfahrten.length, abfahrt, v.isCancelled, v.isAdditional));
  });

  return <div className={cc({ cancelled })}>{via}</div>;
}

type StateProps = {|
  showSupersededMessages: boolean,
|};

type OwnProps = {|
  abfahrt: Abfahrt,
  detail: boolean,
|};

type Props = {|
  ...StateProps,
  ...OwnProps,
|};

const Via = ({ abfahrt, detail, showSupersededMessages }: Props) => {
  const info = detail ? getDetailedInfo(abfahrt, showSupersededMessages) : getInfo(abfahrt);

  return (
    <div className={cc(['Via', { detail }])}>
      {info}
      {(detail || !info) && (detail ? getDetailedVia(abfahrt) : getNormalVia(abfahrt))}
    </div>
  );
};

export default connect<AppState, Function, OwnProps, StateProps>(state => ({
  showSupersededMessages: state.config.config.showSupersededMessages,
}))(Via);
