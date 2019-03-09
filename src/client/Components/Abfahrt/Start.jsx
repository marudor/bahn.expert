// @flow
import './Start.scss';
import Auslastung from './Auslastung';
import CheckInLink from './CheckInLink';
import React from 'react';
import Substitute from './Substitute';
import type { Abfahrt } from 'types/abfahrten';

type Props = {|
  +abfahrt: Abfahrt,
  +detail: boolean,
  +lineAndNumber: boolean,
|};

const Start = ({ abfahrt, detail, lineAndNumber }: Props) => (
  <div className="Start">
    <span>{abfahrt.train}</span>
    {lineAndNumber && abfahrt.trainNumber !== abfahrt.trainId && (
      <>
        <span>
          {abfahrt.trainType} {abfahrt.trainNumber}
        </span>
      </>
    )}
    {detail && <CheckInLink abfahrt={abfahrt} />}
    {abfahrt.isCancelled && <span className="Start__cancelled">Zugausfall</span>}
    {abfahrt.substitute && abfahrt.ref && <Substitute substitute={abfahrt.ref} />}
    {detail && abfahrt.auslastung && <Auslastung abfahrt={abfahrt} />}
  </div>
);

export default Start;
