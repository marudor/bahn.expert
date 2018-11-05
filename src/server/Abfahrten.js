// @flow
import axios from 'axios';
import type { Abfahrt } from 'types/abfahrten';

const trainRegex = /(\w+?)?? ?(RS|STB|IRE|RE|RB|IC|ICE|EC|ECE|TGV|NJ|RJ|S)? ?(\d+\w*)/;

function getTrainType(thirdParty, trainType) {
  if ((thirdParty === 'NWB' && trainType === 'RS') || thirdParty === 'BSB') {
    return 'S';
  }
  if (thirdParty === 'FLX') {
    return 'IR';
  }
  if (thirdParty) {
    return 'RB';
  }
  if (trainType === 'ECE') {
    return 'EC';
  }

  return trainType;
}

function getTrainId(thirdParty, rawTrainType, trainId) {
  if (thirdParty === 'NWB' && rawTrainType === 'RS') {
    return `${rawTrainType}${trainId}`;
  }

  return trainId || undefined;
}

export function splitTrainType(train: string = '') {
  const parsed = trainRegex.exec(train);

  if (parsed) {
    const thirdParty = parsed[1] || undefined;
    const trainType = getTrainType(thirdParty, parsed[2]);

    return {
      thirdParty,
      trainType,
      trainId: getTrainId(thirdParty, parsed[2], parsed[3]),
    };
  }

  return {
    thirdParty: undefined,
    trainType: undefined,
    trainId: undefined,
  };
}

const longDistanceRegex = /(ICE?|TGV|ECE?|RJ).*/;

const DBFHost = process.env.DBF_HOST || 'https://dbf.marudor.de';

// http://dbf.finalrewind.org/KD?mode=marudor&backend=iris&version=2
export function evaIdAbfahrten(evaId: string) {
  return axios.get(`${DBFHost}/${evaId}?mode=marudor&backend=iris&version=4`).then(d => {
    if (d.data.error) {
      throw d.data;
    }
    const departures: Abfahrt[] = d.data.departures.map(dep => ({
      ...dep,
      // id: calculateTrainId(dep),
      ...splitTrainType(dep.train),
      longDistance: longDistanceRegex.test(dep.train),
    }));

    return departures;
  });
}
