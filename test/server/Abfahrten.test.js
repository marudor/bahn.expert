// @flow
import { splitTrainType } from 'server/Abfahrten';
import createApp from 'server/app';
import supertest from 'supertest';

function testTrainType(input, expThirdParty, expTrainType, expTrainId) {
  // $FlowFixMe
  it(`${input} to match ${expThirdParty}, ${expTrainType}, ${expTrainId}`, () => {
    const { thirdParty, trainId, trainType } = splitTrainType(input);

    expect(thirdParty).toBe(expThirdParty);
    expect(trainId).toBe(expTrainId);
    expect(trainType).toBe(expTrainType);
  });
}
describe('Abfahrten', () => {
  describe('Abfahrten', () => {
    let server;
    let request;

    beforeAll(() => {
      const app = createApp();

      server = app.listen();
      request = supertest(server);
    });
    afterAll(done => {
      server.close(done);
    });

    it('invalid evaID', () =>
      request
        .get('/api/dbfAbfahrten/KD')
        .expect(400)
        .expect({
          message: 'Please provide a evaID',
        }));

    // it('dbf errors', () => request.get('/api/abfahrten/8098105').expect(500));
  });

  describe('Correct train split', () => {
    testTrainType('');
    testTrainType();
    testTrainType('RE 123', undefined, 'RE', '123');
    testTrainType('VIA RB10', 'VIA', 'RB', '10');
    testTrainType('NWB RE2', 'NWB', 'RB', '2');
    testTrainType('WFB RE60', 'WFB', 'RB', '60');
    testTrainType('S 5X', undefined, 'S', '5X');
    testTrainType('EBx 12', 'EBx', 'RB', '12');
    testTrainType('ALX 84111', 'ALX', 'RB', '84111');
    testTrainType('M 79073', 'M', 'RB', '79073');
    testTrainType('BOB 86975', 'BOB', 'RB', '86975');
    testTrainType('BSB 88378', 'BSB', 'S', '88378');
    testTrainType('ECE 123', undefined, 'EC', '123');
    testTrainType('IRE 87488', undefined, 'IRE', '87488');
    testTrainType('ABR RB40', 'ABR', 'RB', '40');
    testTrainType('NWB RB75', 'NWB', 'RB', '75');
    testTrainType('NWB RE18', 'NWB', 'RB', '18');
    testTrainType('ERB 61', 'E', 'RB', '61');
    testTrainType('ME RE5', 'ME', 'RB', '5');
    testTrainType('ME RB61', 'ME', 'RB', '61');
    testTrainType('FLX 1807', 'FLX', 'IR', '1807');
  });
});
