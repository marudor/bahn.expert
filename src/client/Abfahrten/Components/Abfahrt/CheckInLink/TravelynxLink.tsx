import { Abfahrt } from 'types/abfahrten';
import { isBefore } from 'date-fns';
import { preventDefault } from '.';
import React from 'react';

type Props = {
  abfahrt: Abfahrt;
  className?: string;
};

// 30 Minutes in ms
const timeConstraint = 30 * 60 * 1000;

const TravelynxLink = ({ abfahrt, className }: Props) =>
  abfahrt.departure &&
  !abfahrt.departureIsCancelled &&
  isBefore(
    abfahrt.scheduledArrival || abfahrt.scheduledDeparture || abfahrt.departure,
    Date.now() + timeConstraint
  ) ? (
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
