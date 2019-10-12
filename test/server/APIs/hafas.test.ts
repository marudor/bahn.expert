import { checkApi, mockWithFile } from './helper';
import { versions } from 'server/APIs/hafas';
jest.mock('node-cache');

describe('Hafas API', () => {
  versions.forEach(v => {
    describe(v, () => {
      it('/ArrStationBoard', async () => {
        mockWithFile(
          'https://reiseauskunft.bahn.de',
          '/bin/mgate.exe?checksum=3428c12b558f57fdf205f1ea9ac02cc5',
          'hafas/ArrStationBoard',
          'post'
        );
        await checkApi(
          `/api/hafas/${v}/ArrStationBoard?date=1561640562662&station=8002549`
        );
      });
      it('/DepStationBoard', async () => {
        mockWithFile(
          'https://reiseauskunft.bahn.de',
          '/bin/mgate.exe?checksum=8e4ca9edea5c9f5cc87431398bd1dd12',
          'hafas/DepStationBoard',
          'post'
        );
        await checkApi(
          `/api/hafas/${v}/DepStationBoard?date=1561640562662&station=8002549`
        );
      });
      it('/journeyDetails', async () => {
        mockWithFile(
          'https://reiseauskunft.bahn.de',
          '/bin/mgate.exe?checksum=e3d62c1eb4cd8a7cd83d7f3f3ffd6488',
          'hafas/journeyDetails',
          'post'
        );
        await checkApi(`/api/hafas/${v}/journeyDetails/1|325745|0|80|27062019`);
      });
      it('/details', async () => {
        mockWithFile(
          'https://reiseauskunft.bahn.de',
          '/bin/trainsearch.exe/dn?L=vs_json&date=01.07.2019&trainname=ICE+70&stationFilter=80&productClassFilter=31',
          'hafas/details/trainsearch'
        );
        mockWithFile(
          'https://reiseauskunft.bahn.de',
          '/bin/mgate.exe?checksum=136a0523e7ae6fd5b99ffb0faa496864',
          'hafas/details/journeyDetails',
          'post'
        );
        mockWithFile(
          'https://reiseauskunft.bahn.de',
          '/bin/mgate.exe?checksum=595063c9f9d5ade80ee2cfae70b1056b',
          'hafas/details/searchOnTrip',
          'post'
        );
        mockWithFile(
          'https://iris.noncd.db.de',
          '/iris-tts/timetable/station/8509000',
          'hafas/details/irisStation'
        );
        mockWithFile(
          'https://iris.noncd.db.de',
          '/iris-tts/timetable/station/8575112',
          'hafas/details/irisStation2'
        );
        mockWithFile(
          'https://iris.noncd.db.de',
          '/iris-tts/timetable/fchg/8509000',
          'hafas/details/fchgChur'
        );
        await checkApi(
          `/api/hafas/${v}/details/ICE 70/1561966025283?stop=8509000`
        );
      });
      it('/auslastung', async () => {
        mockWithFile(
          'https://reiseauskunft.bahn.de',
          '/bin/mgate.exe?checksum=7e80aaeb60b2c758b94eb48e3c55443f',
          'hafas/auslastung/station1',
          'post'
        );
        mockWithFile(
          'https://reiseauskunft.bahn.de',
          '/bin/mgate.exe?checksum=1dfefef85395f73dc69107adbd1c20ad',
          'hafas/auslastung/station2',
          'post'
        );
        mockWithFile(
          'https://reiseauskunft.bahn.de',
          '/bin/mgate.exe?checksum=3978819179289f2f50715c32d200e6ce',
          'hafas/auslastung/route',
          'post'
        );
        await checkApi(
          `/api/hafas/${v}/auslastung/8000105/Dresden%20Hbf/1653/1561641600000`
        );
      });
      it('/trainSearch', async () => {
        mockWithFile(
          'https://reiseauskunft.bahn.de',
          '/bin/trainsearch.exe/dn?L=vs_json&date=01.07.2019&trainname=EC+8&stationFilter=80&productClassFilter=31',
          'hafas/trainsearch/trainsearch'
        );
        mockWithFile(
          'https://reiseauskunft.bahn.de',
          '/bin/mgate.exe?checksum=b6edd45e46e9d27905abf3a7fee4f01f',
          'hafas/trainsearch/journeyDetails',
          'post'
        );
        await checkApi(`/api/hafas/${v}/trainSearch/EC 8/1561965660841`);
      });
      it('/geoStation', async () => {
        mockWithFile(
          'https://reiseauskunft.bahn.de',
          '/bin/mgate.exe?checksum=21010a8a41ab0e4d68352e4bfe20077d',
          'hafas/geoStation',
          'post'
        );
        await checkApi(`/api/hafas/${v}/geoStation?lat=53.5568&lng=9.9898`);
      });
      it('/station', async () => {
        mockWithFile(
          'https://reiseauskunft.bahn.de',
          '/bin/mgate.exe?checksum=44508eb0953b3fb50df7b66751abda2f',
          'hafas/station',
          'post'
        );
        await checkApi(`/api/hafas/${v}/station/Düsseldorf`);
      });
      it('/route', async () => {
        mockWithFile(
          'https://reiseauskunft.bahn.de',
          '/bin/mgate.exe?checksum=655550e5d81180d6ac44671f8ef6e890',
          'hafas/route',
          'post'
        );

        await checkApi(`/api/hafas/${v}/route`, 200, {
          start: '8000105',
          destination: '8002549',
          time: 1561911240000,
          maxChanges: '0',
          transferTime: '0',
        });
      });
      it('/searchOnTrip', async () => {
        mockWithFile(
          'https://reiseauskunft.bahn.de',
          '/bin/mgate.exe?checksum=8e62d56611098a364a5fda1c8719b99b',
          'hafas/searchOnTrip',
          'post'
        );

        await checkApi(`/api/hafas/${v}/SearchOnTrip`, undefined, {
          sotMode: 'RC',
          id:
            '¶HKI¶T$A=1@L=8000191@a=128@$A=1@L=8010205@a=128@$201907010706$201907011410$IC  2063$$1$',
        });
      });
    });
  });
});
