// @flow
import './TraewellingLink.scss';
import { connect } from 'react-redux';
import React from 'react';
import type { Abfahrt } from 'types/abfahrten';
import type { AppState } from 'AppState';

type StateProps = {
  station: ?string,
  show: boolean,
};

type Props = StateProps & {
  abfahrt: Abfahrt,
};

function preventDefault(e: SyntheticMouseEvent<>) {
  e.stopPropagation();

  return false;
}

const TraewellingLink = ({ abfahrt, station, show }: Props) => {
  const departure = abfahrt.scheduledDeparture;

  if (!departure || !station || !show) {
    return null;
  }
  // const start = abfahrt.route[0].name;
  const destination = abfahrt.route[abfahrt.route.length - 1].name;
  const time = departure.toFormat('HH:mm').replace(':', '%3A');
  const date = departure.toFormat('yyyy-MM-dd');

  return (
    <a
      className="TraewellingLink"
      onClick={preventDefault}
      rel="noopener noreferrer"
      target="_blank"
      href={`https://traewelling.de/checkin?ris=2&2_cat=${abfahrt.trainType}&2_id=${
        abfahrt.trainNumber
      }&2_start=${station}&2_to=${destination}&2_tm=${time}&2_date=${date}`}
    >
      Traewelling
    </a>
  );
};

export default connect((state: AppState) => ({
  station: state.abfahrten.currentStation?.title,
  show: state.config.traewelling,
}))(TraewellingLink);
