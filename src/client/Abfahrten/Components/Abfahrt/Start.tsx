import { Abfahrt } from 'types/abfahrten';
import Auslastung from 'Abfahrten/Components/Abfahrt/Auslastung';
import CheckInLink from './CheckInLink';
import React from 'react';
import Substitute from './Substitute';
import useStyles from './Start.style';

type OwnProps = {
  abfahrt: Abfahrt;
  detail: boolean;
  lineAndNumber: boolean;
};

type Props = OwnProps;

const Start = ({ abfahrt, detail, lineAndNumber }: Props) => {
  const classes = useStyles();

  return (
    <div className={classes.main}>
      <span>{abfahrt.train.full}</span>
      {lineAndNumber && abfahrt.train.line && (
        <>
          <span>
            {abfahrt.train.type} {abfahrt.train.number}
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
};

export default Start;
