import { checkApi, mockWithFile } from './helper';
import { versions } from 'server/APIs/hafas';
jest.mock('node-cache');

describe('Hafas API', () => {
  versions.forEach(v => {
    describe(v, () => {
      it('/ArrStationBoard', async () => {
        mockWithFile(
          'https://reiseauskunft.bahn.de',
          '/bin/mgate.exe?checksum=439583794adf5fb8a4d17789f2b0f319',
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
          '/bin/mgate.exe?checksum=2a399d6dbf78f7996b0c2d9831256a0b',
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
          '/bin/mgate.exe?checksum=f17a867b46303461b6686988157c7178',
          'hafas/journeyDetails',
          'post'
        );
        await checkApi(`/api/hafas/${v}/journeyDetails/1|325745|0|80|27062019`);
      });
      it('/details', async () => {
        mockWithFile(
          'https://reiseauskunft.bahn.de',
          '/bin/mgate.exe?checksum=1ee9aa97b0b20f502efa35004149c825',
          'hafas/details/journeyMatch',
          'post'
        );
        mockWithFile(
          'https://reiseauskunft.bahn.de',
          '/bin/mgate.exe?checksum=0f6113def1f01582e55e1e3eb2f18de7',
          'hafas/details/journeyDetails',
          'post'
        );
        mockWithFile(
          'https://reiseauskunft.bahn.de',
          '/bin/mgate.exe?checksum=4f1040948f18e2b310842948574d154c',
          'hafas/details/searchOnTrip',
          'post'
        );
        mockWithFile(
          'https://iris.noncd.db.de',
          '/iris-tts/timetable/station/8010101',
          'hafas/details/irisStation'
        );
        mockWithFile(
          'https://iris.noncd.db.de',
          '/iris-tts/timetable/station/8071357',
          'hafas/details/irisStation2'
        );
        mockWithFile(
          'https://iris.noncd.db.de',
          '/iris-tts/timetable/plan/8010101/190808/13',
          'hafas/details/plan1'
        );
        mockWithFile(
          'https://iris.noncd.db.de',
          '/iris-tts/timetable/plan/8010101/190808/12',
          'hafas/details/plan2'
        );
        mockWithFile(
          'https://iris.noncd.db.de',
          '/iris-tts/timetable/plan/8010101/190808/14',
          'hafas/details/plan3'
        );
        mockWithFile(
          'https://iris.noncd.db.de',
          '/iris-tts/timetable/fchg/8010101',
          'hafas/details/fchg'
        );
        await checkApi(
          `/api/hafas/${v}/details/ICE 508/1565270291675?stop=8010101`
        );
      });
      it('/auslastung', async () => {
        mockWithFile(
          'https://reiseauskunft.bahn.de',
          '/bin/mgate.exe?checksum=5b4441fa88800f30948f6947006e9185',
          'hafas/auslastung/station1',
          'post'
        );
        mockWithFile(
          'https://reiseauskunft.bahn.de',
          '/bin/mgate.exe?checksum=635fcf548770455c86aa99b8fcdaefd5',
          'hafas/auslastung/station2',
          'post'
        );
        mockWithFile(
          'https://reiseauskunft.bahn.de',
          '/bin/mgate.exe?checksum=c54a7a2b1b90fa528566abb4cc34800d',
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
          '/bin/mgate.exe?checksum=3a1cead346b2fae9e7fbfdd056804b82',
          'hafas/trainsearch/journeyDetails',
          'post'
        );
        await checkApi(`/api/hafas/${v}/trainSearch/EC 8/1561965660841`);
      });
      it('/geoStation', async () => {
        mockWithFile(
          'https://reiseauskunft.bahn.de',
          '/bin/mgate.exe?checksum=c01300dbc10a396666c0a274bcbce802',
          'hafas/geoStation',
          'post'
        );
        await checkApi(`/api/hafas/${v}/geoStation?lat=53.5568&lng=9.9898`);
      });
      it('/station', async () => {
        mockWithFile(
          'https://reiseauskunft.bahn.de',
          '/bin/mgate.exe?checksum=c847e37cf940a2ffa93c33c5069fcff7',
          'hafas/station',
          'post'
        );
        await checkApi(`/api/hafas/${v}/station/Düsseldorf`);
      });
      it('/route', async () => {
        mockWithFile(
          'https://reiseauskunft.bahn.de',
          '/bin/mgate.exe?checksum=ad829c73eba27349153cfff992bbd474',
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
          '/bin/mgate.exe?checksum=16a6453b341026ea45b9e87a55914317',
          'hafas/searchOnTrip',
          'post'
        );

        await checkApi(
          `/api/hafas/${v}/SearchOnTrip/¶HKI¶T$A=1@L=8000191@a=128@$A=1@L=8010205@a=128@$201907010706$201907011410$IC  2063$$1$`
        );
      });
    });
  });
});
