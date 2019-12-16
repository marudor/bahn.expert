import { CheckInType } from 'Common/config';
import { parse } from 'date-fns';
import { render } from 'testHelper';
import CheckInLink from 'Common/Components/CheckInLink';
import lolex, { InstalledClock } from 'lolex';
import MockAbfahrt from 'Test/client/__fixtures__/abfahrt.json';

describe('CheckInLink', () => {
  describe('Travellynx', () => {
    let clock: InstalledClock;

    beforeAll(() => {
      clock = lolex.install();
    });
    afterEach(() => {
      clock.reset();
    });
    afterAll(() => {
      clock.uninstall();
    });
    it('Renders Travellynx if arrival in 20 Minutes', () => {
      clock.setSystemTime(parse('22.07.2019 14:19', 'dd.MM.yyyy HH:mm', 0));

      const { getByTestId } = render(
        CheckInLink,
        {
          abfahrt: MockAbfahrt,
        },
        {
          commonConfig: {
            checkIn: CheckInType.Travelynx,
          },
        }
      );

      getByTestId('travellynxlink');
    });
    it('Renders Travellynx if departure in 20 Minutes and arrival not existant', () => {
      clock.setSystemTime(parse('22.07.2019 14:19', 'dd.MM.yyyy HH:mm', 0));

      const { getByTestId } = render(
        CheckInLink,
        {
          abfahrt: {
            ...MockAbfahrt,
            arrival: undefined,
          },
        },
        {
          commonConfig: {
            checkIn: CheckInType.Travelynx,
          },
        }
      );

      getByTestId('travellynxlink');
    });
    it('Renders no link if arrival >30 Minutes away', () => {
      clock.setSystemTime(parse('22.07.2019 14:08', 'dd.MM.yyyy HH:mm', 0));

      const { queryByTestId } = render(
        CheckInLink,
        {
          abfahrt: MockAbfahrt,
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
      clock.setSystemTime(parse('22.07.2019 14:19', 'dd.MM.yyyy HH:mm', 0));
      const { getByTestId } = render(
        CheckInLink,
        {
          abfahrt: {
            ...MockAbfahrt,
            arrival: {
              ...MockAbfahrt.arrival,
              time: parse('22.07.2019 17:52', 'dd.MM.yyyy HH:mm', 0).getTime(),
            },
          },
        },
        {
          commonConfig: {
            checkIn: CheckInType.Travelynx,
          },
        }
      );

      getByTestId('travellynxlink');
    });
  });

  it('Renders none', () => {
    const { queryByTestId } = render(
      CheckInLink,
      {
        abfahrt: MockAbfahrt,
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
