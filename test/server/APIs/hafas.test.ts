import { checkApi, mockWithFile } from './helper';
import { versions } from 'server/APIs/hafas';
jest.mock('node-cache');

describe('Hafas API', () => {
  versions.forEach(v => {
    describe(v, () => {
      it('/ArrStationBoard', async () => {
        mockWithFile(
          'https://reiseauskunft.bahn.de',
          '/bin/mgate.exe?checksum=0ddac2eb61d8f60e75c5912f09c04fd0',
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
          '/bin/mgate.exe?checksum=c9e8b08376285db725fa51ca2c51cd9e',
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
          '/bin/mgate.exe?checksum=2ea5723c04a49b1c43afdb773625ad07',
          'hafas/journeyDetails',
          'post'
        );
        await checkApi(`/api/hafas/${v}/journeyDetails/1|325745|0|80|27062019`);
      });
      it('/details', async () => {
        mockWithFile(
          'https://reiseauskunft.bahn.de',
          '/bin/trainsearch.exe/dn?L=vs_json&date=27.06.2019&trainname=ICE+70',
          'hafas/details/trainsearch'
        );
        mockWithFile(
          'https://reiseauskunft.bahn.de',
          '/bin/mgate.exe?checksum=fba8679a8298d0e89f94334f6e12d2ea',
          'hafas/details/journeyDetails',
          'post'
        );
        await checkApi(`/api/hafas/${v}/details/ICE 70/1561641713652`);
      });
      it('/auslastung', async () => {
        mockWithFile(
          'https://reiseauskunft.bahn.de',
          '/bin/mgate.exe?checksum=193e276b918a7a2ddd109b335ebab039',
          'hafas/auslastung/station1',
          'post'
        );
        mockWithFile(
          'https://reiseauskunft.bahn.de',
          '/bin/mgate.exe?checksum=632ceead0d80ab2f9b27140fe5319533',
          'hafas/auslastung/station2',
          'post'
        );
        mockWithFile(
          'https://reiseauskunft.bahn.de',
          '/bin/mgate.exe?checksum=cf4950991319ce79a377d44ddede85dd',
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
          '/bin/trainsearch.exe/dn?L=vs_json&date=27.06.2019&trainname=EC+8',
          'hafas/trainsearch'
        );
        await checkApi(`/api/hafas/${v}/trainSearch/EC 8/1561641600000`);
      });
      it('/geoStation', async () => {
        mockWithFile(
          'https://reiseauskunft.bahn.de',
          '/bin/mgate.exe?checksum=f5702cf5a8f630172218012273209065',
          'hafas/geoStation',
          'post'
        );
        await checkApi(`/api/hafas/${v}/geoStation?lat=53.5568&lng=9.9898`);
      });
      it('/station', async () => {
        mockWithFile(
          'https://reiseauskunft.bahn.de',
          '/bin/mgate.exe?checksum=101c916dcf6719ef9a0497fb144bc224',
          'hafas/station',
          'post'
        );
        await checkApi(`/api/hafas/${v}/station/Düsseldorf`);
      });
      it('/route', async () => {
        mockWithFile(
          'https://reiseauskunft.bahn.de',
          '/bin/mgate.exe?checksum=1c0de2646692fa07626487793f881d90',
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
    });
  });
});
