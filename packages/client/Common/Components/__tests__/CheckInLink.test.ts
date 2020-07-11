import { CheckInType } from 'client/Common/config';
import { parse } from 'date-fns';
import { render } from 'client/__tests__/testHelper';
import CheckInLink from 'client/Common/Components/CheckInLink';
import MockAbfahrt from './__fixtures__/abfahrt.json';

describe('CheckInLink', () => {
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

      const { getByTestId } = render(
        CheckInLink,
        {
          arrival: MockAbfahrt.arrival,
          departure: MockAbfahrt.departure,
          station: MockAbfahrt.currentStation,
          train: MockAbfahrt.train,
        },
        {
          commonConfig: {
            checkIn: CheckInType.Travelynx,
          },
        }
      );

      expect(getByTestId('travellynxlink')).toBeInTheDocument();
    });
    it('Renders Travellynx if departure in 20 Minutes and arrival not existant', () => {
      jest.setSystemTime(parse('22.07.2019 14:19', 'dd.MM.yyyy HH:mm', 0));

      const { getByTestId } = render(
        CheckInLink,
        {
          departure: MockAbfahrt.departure,
          station: MockAbfahrt.currentStation,
          train: MockAbfahrt.train,
        },
        {
          commonConfig: {
            checkIn: CheckInType.Travelynx,
          },
        }
      );

      expect(getByTestId('travellynxlink')).toBeInTheDocument();
    });
    it('Renders no link if arrival >30 Minutes away', () => {
      jest.setSystemTime(parse('22.07.2019 14:08', 'dd.MM.yyyy HH:mm', 0));

      const { queryByTestId } = render(
        CheckInLink,
        {
          arrival: MockAbfahrt.arrival,
          departure: MockAbfahrt.departure,
          station: MockAbfahrt.currentStation,
          train: MockAbfahrt.train,
        },
        {
          commonConfig: {
            checkIn: CheckInType.Travelynx,
          },
        }
      );

      expect(queryByTestId('travellynxlink')).toBeNull();
    });
    it('Renders link if arrival >30 Minutes but planned arrival <30', () => {
      jest.setSystemTime(parse('22.07.2019 14:19', 'dd.MM.yyyy HH:mm', 0));
      const { getByTestId } = render(
        CheckInLink,
        {
          departure: MockAbfahrt.departure,
          station: MockAbfahrt.currentStation,
          train: MockAbfahrt.train,
          arrival: {
            ...MockAbfahrt.arrival,
            time: parse('22.07.2019 17:52', 'dd.MM.yyyy HH:mm', 0).getTime(),
          },
        },
        {
          commonConfig: {
            checkIn: CheckInType.Travelynx,
          },
        }
      );

      expect(getByTestId('travellynxlink')).toBeInTheDocument();
    });
  });

  it('Renders none', () => {
    const { queryByTestId } = render(
      CheckInLink,
      {
        arrival: MockAbfahrt.arrival,
        departure: MockAbfahrt.departure,
        station: MockAbfahrt.currentStation,
        train: MockAbfahrt.train,
      },
      {
        commonConfig: {
          checkIn: CheckInType.None,
        },
      }
    );

    expect(queryByTestId('travellynxlink')).toBeNull();
  });
});
