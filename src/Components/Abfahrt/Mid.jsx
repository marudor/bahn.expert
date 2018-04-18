// @flow
import './Mid.scss';
import { type Abfahrt } from 'types/abfahrten';
import { normalizeName } from 'util';
import cc from 'classcat';
import React from 'react';
import Via from './Via';

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
  </div>
);

export default Mid;
