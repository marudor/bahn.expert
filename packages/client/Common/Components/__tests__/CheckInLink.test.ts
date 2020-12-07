import { parse } from 'date-fns';
import { render } from 'client/__tests__/testHelper';
import { TravelynxLink } from 'client/Common/Components/CheckInLink/TravelynxLink';
import fs from 'fs';
import path from 'path';
import type { Abfahrt } from 'types/iris';

const MockAbfahrt = global.parseJson<Abfahrt>(
  fs.readFileSync(
    path.resolve(__dirname, './__fixtures__/abfahrt.json'),
    'utf8',
  ),
);

describe('Travellynx', () => {
  beforeAll(() => {
    jest.useFakeTimers('modern');
  });
  afterEach(() => {
    jest.runAllTimers();
  });
  afterAll(() => {
    jest.useRealTimers();
  });
  it('Renders Travellynx if arrival in 20 Minutes', () => {
    jest.setSystemTime(parse('22.07.2019 14:19', 'dd.MM.yyyy HH:mm', 0));

    const { getByTestId } = render(TravelynxLink, {
      arrival: MockAbfahrt.arrival,
      departure: MockAbfahrt.departure,
      station: MockAbfahrt.currentStation,
      train: MockAbfahrt.train,
    });

    expect(getByTestId('travellynxlink')).toBeInTheDocument();
  });
  it('Renders Travellynx if departure in 20 Minutes and arrival not existant', () => {
    jest.setSystemTime(parse('22.07.2019 14:19', 'dd.MM.yyyy HH:mm', 0));

    const { getByTestId } = render(TravelynxLink, {
      departure: MockAbfahrt.departure,
      station: MockAbfahrt.currentStation,
      train: MockAbfahrt.train,
    });

    expect(getByTestId('travellynxlink')).toBeInTheDocument();
  });
  it('Renders no link if arrival >30 Minutes away', () => {
    jest.setSystemTime(parse('22.07.2019 14:08', 'dd.MM.yyyy HH:mm', 0));

    const { queryByTestId } = render(TravelynxLink, {
      arrival: MockAbfahrt.arrival,
      departure: MockAbfahrt.departure,
      station: MockAbfahrt.currentStation,
      train: MockAbfahrt.train,
    });

    expect(queryByTestId('travellynxlink')).toBeNull();
  });
  it('Renders link if arrival >30 Minutes but planned arrival <30', () => {
    jest.setSystemTime(parse('22.07.2019 14:19', 'dd.MM.yyyy HH:mm', 0));
    const { getByTestId } = render(TravelynxLink, {
      departure: MockAbfahrt.departure,
      station: MockAbfahrt.currentStation,
      train: MockAbfahrt.train,
      arrival: {
        ...MockAbfahrt.arrival!,
        time: parse('22.07.2019 17:52', 'dd.MM.yyyy HH:mm', 0),
      },
    });

    expect(getByTestId('travellynxlink')).toBeInTheDocument();
  });
});
