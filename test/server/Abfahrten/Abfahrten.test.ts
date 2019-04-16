import { splitTrainType } from 'server/Abfahrten/Timetable';

function testTrainType(
  input?: string,
  expThirdParty?: string,
  expTrainType?: string,
  expTrainId?: string
) {
  it(`${input} to match ${expThirdParty}, ${expTrainType}, ${expTrainId}`, () => {
    const { thirdParty, trainId, trainType } = splitTrainType(input);

    expect(thirdParty).toBe(expThirdParty);
    expect(trainId).toBe(expTrainId);
    expect(trainType).toBe(expTrainType);
  });
}
describe('Abfahrten', () => {
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
    testTrainType('NWB RS2', 'NWB', 'S', 'RS2');
  });
});
