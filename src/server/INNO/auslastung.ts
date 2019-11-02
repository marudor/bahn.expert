import Axios from 'axios';

const axios = Axios.create({
  baseURL: process.env.INNO_URL || '',
  auth: {
    username: process.env.INNO_USER || '',
    password: process.env.INNO_PW || '',
  },
});

async function getPosition(relevantStop: any) {
  const position = (await axios.get('/train/position/byid', {
    params: {
      provider: 'INNO',
      journeyID: relevantStop.journeyID,
      trainID: relevantStop.train.trainID,
    },
  })).data;

  return position;
}

async function getAuslastung(relevantStop: any) {
  const auslastung = (await axios.get('/train/utilization/byid', {
    params: {
      provider: 'INNO',
      journeyID: relevantStop.journeyID,
      stopID: relevantStop.stopID,
      trainID: relevantStop.train.trainID,
    },
  })).data;

  return auslastung.trainUtilization.wagons.reduce((byUic: any, wagon: any) => {
    byUic[wagon.wagonID] = wagon;

    return byUic;
  }, {});
}

export async function getCombinedAuslastung(
  trainId: string,
  stationID: string,
  timeStart: string,
  timeEnd: string
) {
  const stationBoard = (await axios.get('/boards/departure/bystation', {
    params: {
      provider: 'INNO',
      stationID,
      timeStart,
      timeEnd,
    },
  })).data;

  const relevantStop = stationBoard.boards[0].stops.find(
    (s: any) => s.train.trainID === trainId
  );

  let auslastung: any;
  let position: any;

  const auslastungPromise = getAuslastung(relevantStop);
  const positionPromise = getPosition(relevantStop);

  try {
    auslastung = await auslastungPromise;
  } catch (e) {
    // ignore
  }

  try {
    position = await positionPromise;
  } catch (e) {
    // ignore
  }

  return {
    auslastung,
    position,
  };
}
