// @flow
import { type Abfahrt } from 'types/abfahrten';
import { compareDesc, format } from 'date-fns';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import cc from 'classnames';
import React from 'react';
import styles from './Via.styles';
import withStyles, { type StyledProps } from 'react-jss';
import type { AbfahrtenState } from 'AppState';

function getDetailedInfo(abfahrt: Abfahrt, showSupersededMessages: boolean, classes) {
  const today = new Date().getDate();
  let messages = [...abfahrt.messages.delay, ...abfahrt.messages.qos];

  if (!showSupersededMessages) {
    messages = messages.filter(m => !m.superseded && !m.superseeds);
  }

  if (messages.length) {
    const sorted = messages.sort((a, b) => compareDesc(a.timestamp, b.timestamp));

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
              {format(ts, ts.getDate() === today ? 'HH:mm' : 'dd.MM HH:mm')}: {m.text}
            </div>
          );
        })}
      </div>
    );
  }

  return null;
}

function getInfo(abfahrt: Abfahrt, classes) {
  let info = '';

  if (abfahrt.messages.delay.length > 0) {
    info += abfahrt.messages.delay[0].text;
  }
  abfahrt.messages.qos
    .filter(m => !m.superseded && !m.superseeds)
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

function getAbfahrt(
  name: string,
  index: number,
  length: number,
  abfahrt: Abfahrt,
  isCancelled?: boolean,
  isAdditional?: boolean,
  isDetail?: boolean = false,
  classes
) {
  const via = [];
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

function getNormalVia(abfahrt: Abfahrt, classes) {
  let via = [];
  const abfahrten = abfahrt.via;

  abfahrten.forEach((v, index) => {
    via = via.concat(getAbfahrt(v, index, abfahrten.length, abfahrt, abfahrt.isCancelled, false, false, classes));
  });

  return via.length ? via : null;
}

function getDetailedVia(abfahrt: Abfahrt, classes) {
  let via = [];
  const abfahrten = abfahrt.route;

  let cancelled = abfahrt.isCancelled;

  abfahrten.forEach((v, index) => {
    if (v.isCancelled || v.isAdditional) {
      cancelled = false;
    }
    via = via.concat(
      getAbfahrt(v.name, index, abfahrten.length, abfahrt, v.isCancelled, v.isAdditional, true, classes)
    );
  });

  return <div className={cc({ [classes.cancelled]: cancelled })}>{via}</div>;
}

type StateProps = {|
  +showSupersededMessages: boolean,
|};

type OwnProps = {|
  +abfahrt: Abfahrt,
  +detail: boolean,
|};

export type ReduxProps = {|
  ...StateProps,
  ...OwnProps,
  +dispatch: Dispatch<*>,
|};

type Props = StyledProps<ReduxProps, typeof styles>;

const Via = ({ abfahrt, detail, showSupersededMessages, classes }: Props) => {
  const info = detail ? getDetailedInfo(abfahrt, showSupersededMessages, classes) : getInfo(abfahrt, classes);
  const via = (detail || !info) && (detail ? getDetailedVia(abfahrt, classes) : getNormalVia(abfahrt, classes));

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

export default connect<ReduxProps, OwnProps, StateProps, _, AbfahrtenState, _>(state => ({
  showSupersededMessages: state.config.config.showSupersededMessages,
}))(withStyles(styles)(Via));
