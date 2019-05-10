import { Abfahrt } from 'types/abfahrten';
import { AbfahrtenState } from 'AppState';
import { compareDesc, format } from 'date-fns';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import cc from 'classnames';
import React, { ReactNode } from 'react';
import useStyles from './Via.style';

function getDetailedInfo<C extends Record<'cancelled' | 'info', string>>(
  abfahrt: Abfahrt,
  showSupersededMessages: boolean,
  classes: C
) {
  const today = new Date().getDate();
  let messages = [...abfahrt.messages.delay, ...abfahrt.messages.qos];

  if (!showSupersededMessages) {
    messages = messages.filter(m => !m.superseded);
  }

  if (messages.length) {
    const sorted = messages.sort((a, b) =>
      compareDesc(a.timestamp, b.timestamp)
    );

    return (
      <div
        key="i"
        className={cc(classes.info, {
          [classes.cancelled]: abfahrt.isCancelled,
        })}
      >
        {sorted.map((m, i) => {
          const ts = new Date(m.timestamp);

          return (
            <div
              key={i}
              className={cc({
                [classes.cancelled]: m.superseded,
              })}
            >
              {format(ts, ts.getDate() === today ? 'HH:mm' : 'dd.MM HH:mm')}:{' '}
              {m.text}
            </div>
          );
        })}
      </div>
    );
  }

  return null;
}

function getInfo<C extends Record<'info' | 'cancelled', string>>(
  abfahrt: Abfahrt,
  classes: C
) {
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
      className={cc(classes.info, {
        [classes.cancelled]: abfahrt.isCancelled,
      })}
    >
      {info}
    </div>
  ) : null;
}

function getAbfahrt<
  C extends Record<'cancelled' | 'additional' | 'hbf', string>
>(
  classes: C,
  name: string,
  index: number,
  length: number,
  isCancelled?: boolean,
  isAdditional?: boolean,
  isDetail: boolean = false
): ReactNode {
  const via: ReactNode[] = [];
  const lowerName = name.toLowerCase();
  const isHbf =
    lowerName.includes('hbf') ||
    lowerName.includes('centraal') ||
    lowerName.includes('centrale') ||
    lowerName.includes('termini');
  const commonProps = {
    className: cc({
      [classes.cancelled]: isCancelled,
      [classes.additional]: isAdditional,
      [classes.hbf]: isHbf,
    }),
    key: `${index}i`,
    children: name,
  };

  via.push(
    isDetail ? (
      <Link
        {...commonProps}
        onClick={e => e.stopPropagation()}
        to={{
          pathname: encodeURIComponent(name),
          state: { searchType: 'stationsData' },
        }}
        title={`Zugabfahrten für ${name}`}
      />
    ) : (
      <span {...commonProps} />
    )
  );
  if (index + 1 !== length) {
    via.push(' - ');
  }

  return via;
}

function getNormalVia<
  C extends Record<'cancelled' | 'additional' | 'hbf', string>
>(abfahrt: Abfahrt, classes: C) {
  let via: ReactNode[] = [];
  const abfahrten = abfahrt.via;

  abfahrten.forEach((v, index) => {
    via = via.concat(
      getAbfahrt(
        classes,
        v,
        index,
        abfahrten.length,
        abfahrt.isCancelled,
        false
      )
    );
  });

  return via.length ? via : null;
}

function getDetailedVia<
  C extends Record<'cancelled' | 'additional' | 'hbf', string>
>(abfahrt: Abfahrt, classes: C) {
  let via: ReactNode[] = [];
  const abfahrten = abfahrt.route;

  let cancelled = abfahrt.isCancelled;

  abfahrten.forEach((v, index) => {
    if (v.isCancelled || v.isAdditional) {
      cancelled = false;
    }
    via = via.concat(
      getAbfahrt(
        classes,
        v.name,
        index,
        abfahrten.length,
        v.isCancelled,
        v.isAdditional,
        true
      )
    );
  });

  return <div className={cc({ [classes.cancelled]: cancelled })}>{via}</div>;
}

type StateProps = {
  showSupersededMessages: boolean;
};

type OwnProps = {
  abfahrt: Abfahrt;
  detail: boolean;
};

export type ReduxProps = StateProps & OwnProps;

type Props = ReduxProps;

const Via = ({ abfahrt, detail, showSupersededMessages }: Props) => {
  const classes = useStyles();
  const info = detail
    ? getDetailedInfo(abfahrt, showSupersededMessages, classes)
    : getInfo(abfahrt, classes);
  const via =
    (detail || !info) &&
    (detail
      ? getDetailedVia(abfahrt, classes)
      : getNormalVia(abfahrt, classes));

  if (!info && !via) return null;

  return (
    <div
      className={cc(classes.main, {
        [classes.detail]: detail,
      })}
    >
      {info}
      {via}
    </div>
  );
};

export default connect<StateProps, void, OwnProps, AbfahrtenState>(state => ({
  showSupersededMessages: state.abfahrtenConfig.config.showSupersededMessages,
}))(Via);
