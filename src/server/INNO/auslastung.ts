import Axios from 'axios';

const axios = Axios.create({
  baseURL: process.env.INNO_URL || '',
  auth: {
    username: process.env.INNO_USER || '',
    password: process.env.INNO_PW || '',
  },
});

export async function getAuslastung(
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
