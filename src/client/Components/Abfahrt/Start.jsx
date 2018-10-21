// @flow
import './Start.scss';
import Auslastung from './Auslastung';
import cc from 'classnames';
import React from 'react';
import TraewellingLink from './TraewellingLink';
import type { Abfahrt } from 'types/abfahrten';

type Props = {
  abfahrt: Abfahrt,
  detail: boolean,
};

const Start = ({ abfahrt, detail }: Props) => (
  <div className={cc(['Start', { cancelled: abfahrt.isCancelled }])}>
    {abfahrt.train}
    {detail && <TraewellingLink abfahrt={abfahrt} />}
    {detail && abfahrt.longDistance && <Auslastung abfahrt={abfahrt} />}
  </div>
);

export default Start;
