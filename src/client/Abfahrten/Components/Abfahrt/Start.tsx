import { Abfahrt } from 'types/iris';
import Auslastung from 'Abfahrten/Components/Abfahrt/Auslastung';
import CheckInLink from 'Common/Components/CheckInLink';
import DetailsLink from 'Common/Components/Details/DetailsLink';
import React from 'react';
import Substitute from './Substitute';
import useStyles from './Start.style';

interface Props {
  abfahrt: Abfahrt;
  detail: boolean;
  lineAndNumber: boolean;
}

const Start = ({ abfahrt, detail, lineAndNumber }: Props) => {
  const classes = useStyles();

  return (
    <div className={classes.main} data-testid="abfahrtStart">
      <span>{abfahrt.train.name}</span>
      {lineAndNumber && abfahrt.train.line && (
        <span>
          {abfahrt.train.type} {abfahrt.train.number}
        </span>
      )}
      {detail && (
        <div className={classes.links}>
          <CheckInLink
            arrival={abfahrt.arrival}
            departure={abfahrt.departure}
            train={abfahrt.train}
            station={abfahrt.currentStation}
          />
          <DetailsLink
            train={abfahrt.train}
            stationId={abfahrt.currentStation.id}
            initialDeparture={abfahrt.initialDeparture}
          />
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
