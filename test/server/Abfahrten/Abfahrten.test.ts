import { splitTrainType } from 'server/Abfahrten/Timetable';

function testTrainType(
  input?: string,
  trainNumber?: string,
  expThirdParty?: string,
  expTrainType?: string,
  expTrainLine?: string
) {
  it(`${input} to match ${expThirdParty}, ${expTrainType}, ${expTrainLine}`, () => {
    const { thirdParty, line, type } = splitTrainType(input, trainNumber);

    expect(thirdParty).toBe(expThirdParty);
    expect(line).toBe(expTrainLine);
    expect(type).toBe(expTrainType);
  });
}
describe('Abfahrten', () => {
  describe('Correct train split', () => {
    testTrainType('');
    testTrainType();
    testTrainType('RE 123', '6', undefined, 'RE', '123');
    testTrainType('VIA RB10', undefined, 'VIA', 'RB', '10');
    testTrainType('NWB RE2', '123', 'NWB', 'RB', '2');
    testTrainType('WFB RE60', '12341', 'WFB', 'RB', '60');
    testTrainType('S 5X', '', undefined, 'S', '5X');
    testTrainType('EBx 12', '', 'EBx', 'RB', '12');
    testTrainType('ALX 84111', '84111', 'ALX', 'RB');
    testTrainType('M 79073', '79073', 'M', 'RB');
    testTrainType('BOB 86975', '86975', 'BOB', 'RB');
    testTrainType('BSB 88378', '88378', 'BSB', 'S');
    testTrainType('ECE 123', '123', undefined, 'ECE');
    testTrainType('IRE 87488', '', undefined, 'IRE', '87488');
    testTrainType('ABR RB40', '80542', 'ABR', 'RB', '40');
    testTrainType('NWB RB75', '80542', 'NWB', 'RB', '75');
    testTrainType('NWB RE18', '80542', 'NWB', 'RB', '18');
    testTrainType('ERB 61', '80542', 'E', 'RB', '61');
    testTrainType('ME RE5', '80542', 'ME', 'RB', '5');
    testTrainType('ME RB61', '80542', 'ME', 'RB', '61');
    testTrainType('FLX 1807', '1807', 'FLX', 'IR');
    testTrainType('NWB RS2', '80542', 'NWB', 'S', 'RS2');
    testTrainType('BRB 62752', '62752', 'BRB', 'RB');
    testTrainType('Bus SEV', '500', undefined, 'Bus', 'SEV');
  });
});
