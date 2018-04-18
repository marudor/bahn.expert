// @flow
import './Start.scss';
import cc from 'classcat';
import React from 'react';

type Props = {
  train: string,
  cancelled: 0 | 1,
};
const Start = ({ train, cancelled }: Props) => <div className={cc(['Start', { cancelled }])}>{train}</div>;

export default Start;
