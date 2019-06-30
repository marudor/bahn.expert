import { Abfahrt } from 'types/abfahrten';
import { Link } from 'react-router-dom';
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
      <span>{abfahrt.train.name}</span>
      {lineAndNumber && abfahrt.train.line && (
        <>
          <span>
            {abfahrt.train.type} {abfahrt.train.number}
          </span>
        </>
      )}
      {detail && (
        <div className={classes.links}>
          <CheckInLink abfahrt={abfahrt} />
          <Link
            to={`/details/${abfahrt.train.thirdParty || abfahrt.train.type} ${
              abfahrt.train.number
            }/${abfahrt.initialDeparture}`}
          >
            Details
          </Link>
        </div>
      )}
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
