// @flow
import { type Abfahrt } from 'types/abfahrten';
import { normalizeName } from 'util';
import cc from 'classcat';
import React from 'react';
import styles from './Mid.scss';
import Via from './Via';

type Props = {
  abfahrt: Abfahrt,
  detail: boolean,
};

const Mid = ({ abfahrt, detail }: Props) => (
  <div className={cc([styles.mid, { [styles.detail]: detail }])}>
    <Via abfahrt={abfahrt} detail={detail} />
    <div className={cc([styles.destination, { [styles.cancelled]: abfahrt.isCancelled }])}>
      {normalizeName(abfahrt.destination)}
    </div>
  </div>
);

export default Mid;
