// @flow
import './Mid.scss';
import { normalizeName } from 'client/util';
import cc from 'classnames';
import React from 'react';
import Reihung from './Reihung';
import Via from './Via';
import type { Abfahrt } from 'types/abfahrten';

type Props = {
  abfahrt: Abfahrt,
  detail: boolean,
};

const Mid = ({ abfahrt, detail }: Props) => (
  <div className={cc(['Mid', { 'Mid--detail': detail }])}>
    <Via abfahrt={abfahrt} detail={detail} />
    <div className={cc(['Mid__destination', { cancelled: abfahrt.isCancelled }])}>
      {normalizeName(abfahrt.destination)}
    </div>
    {detail && abfahrt.longDistance && <Reihung abfahrt={abfahrt} />}
  </div>
);

export default Mid;
