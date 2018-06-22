// @flow
import './Mid.scss';
import { normalizeName } from 'util';
import AbfahrtContext from './AbfahrtContext';
import cc from 'classcat';
import React from 'react';
import Reihung from './Reihung';
import Via from './Via';

const Mid = () => (
  <AbfahrtContext.Consumer>
    {({ abfahrt, detail }) => (
      <div className={cc(['Mid', { 'Mid--detail': detail }])}>
        <Via />
        <div className={cc(['Mid__destination', { cancelled: abfahrt.isCancelled }])}>
          {normalizeName(abfahrt.destination)}
        </div>
        {detail && abfahrt.longDistance && <Reihung abfahrt={abfahrt} />}
      </div>
    )}
  </AbfahrtContext.Consumer>
);

export default Mid;
