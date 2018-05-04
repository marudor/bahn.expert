// @flow
import './Start.scss';
import { type Abfahrt } from 'types/abfahrten';
import Auslastung from './Auslastung';
import cc from 'classcat';
import React from 'react';

type Props = {
  abfahrt: Abfahrt,
  detail: boolean,
};

const LongDistanceRegex = /(ICE?|TGV|ECE?).*/;
const Start = ({ abfahrt, detail }: Props) => (
  <div className={cc(['Start', { cancelled: abfahrt.isCancelled }])}>
    {abfahrt.train}
    {detail && LongDistanceRegex.test(abfahrt.train) && <Auslastung abfahrt={abfahrt} />}
  </div>
);

export default Start;
