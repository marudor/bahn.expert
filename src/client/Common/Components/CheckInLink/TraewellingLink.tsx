/* eslint max-len: 0 */
import { Abfahrt } from 'types/api/iris';
import { format } from 'date-fns';
import React from 'react';
import stopPropagation from 'Common/stopPropagation';

type Props = {
  abfahrt: Pick<Abfahrt, 'departure' | 'train' | 'route' | 'currentStation'>;
  className?: string;
};

// Mobile Traewelling
// https://mobile.traewelling.de/page.php?module=ris&ris=2&2_cat=${abfahrt.trainType}&2_id=${abfahrt.trainType === 'S' ? abfahrt.trainLine : abfahrt.trainNumber}&2_start=${abfahrt.currentStation}&2_to=${destination}&2_tm=${time}&2_date=${date}
// Traewelling
// https://traewelling.de/checkin?ris=2&2_cat=${abfahrt.trainType}&2_id=${abfahrt.trainType === 'S' ? abfahrt.trainLine : abfahrt.trainNumber}&2_start=${abfahrt.currentStation}&2_to=${destination}&2_tm=${time}&2_date=${date}

const TraewellingLink = ({ abfahrt, className }: Props) => {
  if (!abfahrt.departure || !abfahrt.train.type) {
    return null;
  }
  // const start = abfahrt.route[0].name;
  const destination = abfahrt.route[abfahrt.route.length - 1].name.replace(
    /ß/g,
    'ss'
  );
  const time = format(abfahrt.departure.scheduledTime, 'HH:mm').replace(
    ':',
    '%3A'
  );
  const date = format(abfahrt.departure.scheduledTime, 'yyyy-MM-dd');

  return (
    <a
      data-testid="traewellingLink"
      className={className}
      onClick={stopPropagation}
      rel="noopener noreferrer"
      target="_blank"
      href={`https://traewelling.de/checkin?ris=2&2_cat=${
        abfahrt.train.type
      }&2_id=${
        abfahrt.train.type === 'S' ? abfahrt.train.line : abfahrt.train.number
      }&2_start=${abfahrt.currentStation.title.replace(
        /ß/g,
        'ss'
      )}&2_to=${destination}&2_tm=${time}&2_date=${date}`}
    >
      Traewelling
    </a>
  );
};

export default React.memo(TraewellingLink);
