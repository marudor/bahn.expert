/* eslint-disable unicorn/prefer-module */
import { parse } from 'date-fns';
import { render } from 'client/__tests__/testHelper';
import { screen } from '@testing-library/react';
import { TravelynxLink } from 'client/Common/Components/CheckInLink/TravelynxLink';
import fs from 'node:fs';
import path from 'node:path';
import type { Abfahrt } from 'types/iris';

const MockAbfahrt = globalThis.parseJson<Abfahrt>(
  fs.readFileSync(
    path.resolve(__dirname, './__fixtures__/abfahrt.json'),
    'utf8',
  ),
);

describe('Travellynx', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.runAllTimers();
  });
  afterAll(() => {
    jest.useRealTimers();
  });
  it('Renders Travellynx if arrival in 20 Minutes', () => {
    jest.setSystemTime(parse('22.07.2019 14:19', 'dd.MM.yyyy HH:mm', 0));

    render(
      <TravelynxLink
        arrival={MockAbfahrt.arrival}
        departure={MockAbfahrt.departure}
        evaNumber={MockAbfahrt.currentStopPlace.evaNumber}
        train={MockAbfahrt.train}
      />,
    );

    expect(screen.getByTestId('travellynxlink')).toBeInTheDocument();
  });
  it('Renders Travellynx if departure in 20 Minutes and arrival not existant', () => {
    jest.setSystemTime(parse('22.07.2019 14:19', 'dd.MM.yyyy HH:mm', 0));

    render(
      <TravelynxLink
        departure={MockAbfahrt.departure}
        evaNumber={MockAbfahrt.currentStopPlace.evaNumber}
        train={MockAbfahrt.train}
      />,
    );

    expect(screen.getByTestId('travellynxlink')).toBeInTheDocument();
  });
  it('Renders no link if arrival >30 Minutes away', () => {
    jest.setSystemTime(parse('22.07.2019 14:08', 'dd.MM.yyyy HH:mm', 0));

    render(
      <TravelynxLink
        arrival={MockAbfahrt.arrival}
        departure={MockAbfahrt.departure}
        evaNumber={MockAbfahrt.currentStopPlace.evaNumber}
        train={MockAbfahrt.train}
      />,
    );

    expect(screen.queryByTestId('travellynxlink')).toBeNull();
  });
  it('Renders link if arrival >30 Minutes but planned arrival <30', () => {
    jest.setSystemTime(parse('22.07.2019 14:19', 'dd.MM.yyyy HH:mm', 0));

    render(
      <TravelynxLink
        departure={MockAbfahrt.departure}
        evaNumber={MockAbfahrt.currentStopPlace.evaNumber}
        train={MockAbfahrt.train}
        arrival={{
          ...MockAbfahrt.arrival!,
          time: parse('22.07.20129 17:52', 'dd.MM.yyyy HH:mm', 0),
        }}
      />,
    );

    expect(screen.getByTestId('travellynxlink')).toBeInTheDocument();
  });
});
