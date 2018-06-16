// @flow
import './Start.scss';
import AbfahrtContext from './AbfahrtContext';
import Auslastung from './Auslastung';
import cc from 'classcat';
import React from 'react';

const Start = () => (
  <AbfahrtContext.Consumer>
    {({ abfahrt, detail }) => (
      <div className={cc(['Start', { cancelled: abfahrt.isCancelled }])}>
        {abfahrt.train}
        {detail && abfahrt.longDistance && <Auslastung abfahrt={abfahrt} />}
      </div>
    )}
  </AbfahrtContext.Consumer>
);

export default Start;
