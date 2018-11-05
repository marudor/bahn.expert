// @flow
/* eslint max-len: 0 */
import './TraewellingLink.scss';
import { connect } from 'react-redux';
import { format } from 'date-fns';
import React from 'react';
import type { Abfahrt } from 'types/abfahrten';
import type { AppState } from 'AppState';

type StateProps = {|
  show: boolean,
|};

type OwnProps = {|
  abfahrt: Abfahrt,
|};

type Props = {|
  ...StateProps,
  ...OwnProps,
|};

function preventDefault(e: SyntheticMouseEvent<>) {
  e.stopPropagation();

  return false;
}

// Mobile Traewelling
// https://mobile.traewelling.de/page.php?module=ris&ris=2&2_cat=${abfahrt.trainType}&2_id=${abfahrt.trainType === 'S' ? abfahrt.trainId : abfahrt.trainNumber}&2_start=${abfahrt.currentStation}&2_to=${destination}&2_tm=${time}&2_date=${date}
// Traewelling
// https://traewelling.de/checkin?ris=2&2_cat=${abfahrt.trainType}&2_id=${abfahrt.trainType === 'S' ? abfahrt.trainId : abfahrt.trainNumber}&2_start=${abfahrt.currentStation}&2_to=${destination}&2_tm=${time}&2_date=${date}

const TraewellingLink = ({ abfahrt, show }: Props) => {
  const departure = abfahrt.scheduledDeparture;

  if (!departure || !show || !abfahrt.trainType || abfahrt.trainType === 'STB') {
    return null;
  }
  // const start = abfahrt.route[0].name;
  const destination = abfahrt.route[abfahrt.route.length - 1].name.replace(/ß/g, 'ss');
  const time = format(departure, 'HH:mm').replace(':', '%3A');
  const date = format(departure, 'yyyy-MM-dd');

  return (
    <a
      className="TraewellingLink"
      onClick={preventDefault}
      rel="noopener noreferrer"
      target="_blank"
      href={`https://traewelling.de/checkin?ris=2&2_cat=${abfahrt.trainType}&2_id=${
        abfahrt.trainType === 'S' ? abfahrt.trainId : abfahrt.trainNumber
      }&2_start=${abfahrt.currentStation.replace(/ß/g, 'ss')}&2_to=${destination}&2_tm=${time}&2_date=${date}`}
    >
      Traewelling
    </a>
  );
};

export default connect<AppState, Function, OwnProps, StateProps>(state => ({
  show: state.config.traewelling,
}))(TraewellingLink);
