// @flow
import { isBefore } from 'date-fns';
import { preventDefault } from '.';
import React from 'react';
import type { Abfahrt } from 'types/abfahrten';

type OwnProps = {|
  +abfahrt: Abfahrt,
|};

type Props = {|
  ...OwnProps,
|};

const TravelynxLink = ({ abfahrt }: Props) =>
  abfahrt.scheduledDeparture &&
  isBefore(abfahrt.scheduledArrival || abfahrt.scheduledDeparture, Date.now() + 600000) ? (
    <a
      className="CheckInLink"
      onClick={preventDefault}
      rel="noopener noreferrer"
      target="_blank"
      href={`https://travelynx.de/s/${abfahrt.currentStationEva}?train=${abfahrt.thirdParty || abfahrt.trainType} ${
        abfahrt.trainNumber
      }`}
    >
      travelynx
    </a>
  ) : null;

export default TravelynxLink;
