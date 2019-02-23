// @flow
import './Mid.scss';
import cc from 'classnames';
import React from 'react';
import Via from './Via';
import type { Abfahrt } from 'types/abfahrten';

type Props = {
  abfahrt: Abfahrt,
  detail: boolean,
};

const Mid = ({ abfahrt, detail }: Props) => (
  <div className={cc(['Mid', { 'Mid--detail': detail }])}>
    <Via abfahrt={abfahrt} detail={detail} />
    <div
      className={cc([
        'Mid__destination',
        {
          cancelled: abfahrt.isCancelled,
          changed: !abfahrt.isCancelled && abfahrt.destination !== abfahrt.scheduledDestination,
        },
      ])}
    >
      {abfahrt.isCancelled ? abfahrt.scheduledDestination : abfahrt.destination}
    </div>
  </div>
);

export default React.memo<Props>(Mid);
