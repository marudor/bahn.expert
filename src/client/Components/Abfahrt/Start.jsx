// @flow
import './Start.scss';
import AbfahrtContext from './AbfahrtContext';
import Auslastung from './Auslastung';
import cc from 'classnames';
import React from 'react';
import TraewellingLink from './TraewellingLink';

const Start = () => (
  <AbfahrtContext.Consumer>
    {({ abfahrt, detail }) => (
      <div className={cc(['Start', { cancelled: abfahrt.isCancelled }])}>
        {abfahrt.train}
        {detail && <TraewellingLink abfahrt={abfahrt} />}
        {detail && abfahrt.longDistance && <Auslastung abfahrt={abfahrt} />}
      </div>
    )}
  </AbfahrtContext.Consumer>
);

export default Start;
