/* eslint max-len: 0 */
import { Abfahrt } from 'types/abfahrten';
import { format } from 'date-fns';
import React, { SyntheticEvent } from 'react';

type Props = {
  abfahrt: Abfahrt;
  className?: string;
};

// Mobile Traewelling
// https://mobile.traewelling.de/page.php?module=ris&ris=2&2_cat=${abfahrt.trainType}&2_id=${abfahrt.trainType === 'S' ? abfahrt.trainId : abfahrt.trainNumber}&2_start=${abfahrt.currentStation}&2_to=${destination}&2_tm=${time}&2_date=${date}
// Traewelling
// https://traewelling.de/checkin?ris=2&2_cat=${abfahrt.trainType}&2_id=${abfahrt.trainType === 'S' ? abfahrt.trainId : abfahrt.trainNumber}&2_start=${abfahrt.currentStation}&2_to=${destination}&2_tm=${time}&2_date=${date}

const stopPropagation = (e: SyntheticEvent) => e.stopPropagation();
const TraewellingLink = ({ abfahrt, className }: Props) => {
  const departure = abfahrt.scheduledDeparture;

  if (!departure || !abfahrt.trainType) {
    return null;
  }
  // const start = abfahrt.route[0].name;
  const destination = abfahrt.route[abfahrt.route.length - 1].name.replace(
    /ß/g,
    'ss'
  );
  const time = format(departure, 'HH:mm').replace(':', '%3A');
  const date = format(departure, 'yyyy-MM-dd');

  return (
    <a
      className={className}
      onClick={stopPropagation}
      rel="noopener noreferrer"
      target="_blank"
      href={`https://traewelling.de/checkin?ris=2&2_cat=${
        abfahrt.trainType
      }&2_id=${
        abfahrt.trainType === 'S' ? abfahrt.trainId : abfahrt.trainNumber
      }&2_start=${abfahrt.currentStation.replace(
        /ß/g,
        'ss'
      )}&2_to=${destination}&2_tm=${time}&2_date=${date}`}
    >
      Traewelling
    </a>
  );
};

export default React.memo(TraewellingLink);
