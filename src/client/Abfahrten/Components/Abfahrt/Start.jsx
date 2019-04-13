// @flow
import Auslastung from './Auslastung';
import CheckInLink from './CheckInLink';
import React from 'react';
import styles from './Start.styles';
import Substitute from './Substitute';
import withStyles, { type StyledProps } from 'react-jss';
import type { Abfahrt } from 'types/abfahrten';

type OwnProps = {|
  +abfahrt: Abfahrt,
  +detail: boolean,
  +lineAndNumber: boolean,
|};

type Props = StyledProps<OwnProps, typeof styles>;

const Start = ({ abfahrt, detail, lineAndNumber, classes }: Props) => (
  <div className={classes.main}>
    <span>{abfahrt.train}</span>
    {lineAndNumber && abfahrt.trainNumber !== abfahrt.trainId && (
      <>
        <span>
          {abfahrt.trainType} {abfahrt.trainNumber}
        </span>
      </>
    )}
    {detail && <CheckInLink abfahrt={abfahrt} />}
    {abfahrt.isCancelled && (
      <span className={classes.cancelled}>Zugausfall</span>
    )}
    {abfahrt.substitute && abfahrt.ref && (
      <Substitute substitute={abfahrt.ref} />
    )}
    {detail && abfahrt.auslastung && <Auslastung abfahrt={abfahrt} />}
  </div>
);

export default withStyles<Props>(styles)(Start);
