// @flow
import { splitTrainType } from 'server/Controller';

describe('Correct train split', () => {
  it('id and type', () => {
    const { trainId, trainType } = splitTrainType('RE 123');

    expect(trainId).toBe(123);
    expect(trainType).toBe('RE');
  });

  it('id with missing type => undefined', () => {
    const { trainId, trainType } = splitTrainType('123');

    expect(trainId).toBeUndefined();
    expect(trainType).toBeUndefined();
  });

  it('type with missing id => undefined', () => {
    const { trainId, trainType } = splitTrainType('IC');

    expect(trainId).toBeUndefined();
    expect(trainType).toBeUndefined();
  });

  it('empty string without error', () => {
    const { trainId, trainType } = splitTrainType('');

    expect(trainId).toBeUndefined();
    expect(trainType).toBeUndefined();
  });

  it('undefined without error', () => {
    const { trainId, trainType } = splitTrainType();

    expect(trainId).toBeUndefined();
    expect(trainType).toBeUndefined();
  });

  it('Handles extra characters', () => {
    const { trainId, trainType } = splitTrainType('IC 2123foo');

    expect(trainId).toBe(2123);
    expect(trainType).toBe('IC');
  });

  it('Handles private company prefix 1', () => {
    const { trainId, trainType } = splitTrainType('VIA RB10');

    expect(trainId).toBe(10);
    expect(trainType).toBe('RB');
  });

  it('Handles private company prefix 2', () => {
    const { trainId, trainType } = splitTrainType('NWB RE2');

    expect(trainId).toBe(2);
    expect(trainType).toBe('RE');
  });
});
