// @flow
import cc from 'classcat';
import React from 'react';
import styles from './Start.scss';

type Props = {
  train: string,
  cancelled: 0 | 1,
};
const Start = ({ train, cancelled }: Props) => (
  <div className={cc([styles.train, { [styles.cancelled]: cancelled }])}>{train}</div>
);

export default Start;
