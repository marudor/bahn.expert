import { Abfahrt } from 'types/abfahrten';
import { isBefore } from 'date-fns';
import { preventDefault } from '.';
import React from 'react';

type Props = {
  abfahrt: Abfahrt;
  className?: string;
};

const TravelynxLink = ({ abfahrt, className }: Props) =>
  abfahrt.departure &&
  !abfahrt.departureIsCancelled &&
  isBefore(abfahrt.arrival || abfahrt.departure, Date.now() + 600000) ? (
    <a
      className={className}
      onClick={preventDefault}
      rel="noopener noreferrer"
      target="_blank"
      href={`https://travelynx.de/s/${
        abfahrt.currentStationEva
      }?train=${abfahrt.thirdParty || abfahrt.trainType} ${
        abfahrt.trainNumber
      }`}
    >
      travelynx
    </a>
  ) : null;

export default TravelynxLink;
