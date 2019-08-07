import { Abfahrt } from 'types/abfahrten';
import { Link } from 'react-router-dom';
import { useAbfahrtenSelector } from 'useSelector';
import Auslastung from 'Abfahrten/Components/Abfahrt/Auslastung';
import CheckInLink from 'Common/Components/CheckInLink';
import React from 'react';
import stopPropagation from 'Common/stopPropagation';
import Substitute from './Substitute';
import useStyles from './Start.style';

type Props = {
  abfahrt: Abfahrt;
  detail: boolean;
  lineAndNumber: boolean;
};

const Start = ({ abfahrt, detail, lineAndNumber }: Props) => {
  const classes = useStyles();
  const checkInType = useAbfahrtenSelector(
    state => state.abfahrtenConfig.config.checkIn
  );

  return (
    <div className={classes.main} data-testid="abfahrtStart">
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
          <CheckInLink abfahrt={abfahrt} type={checkInType} />
          <Link
            onClick={stopPropagation}
            to={`/details/${abfahrt.train.thirdParty ||
              abfahrt.train.type ||
              ''} ${abfahrt.train.number}/${abfahrt.initialDeparture}`}
          >
            Details
          </Link>
        </div>
      )}
      {abfahrt.cancelled && (
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
