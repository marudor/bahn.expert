import { CheckInType } from 'Common/config';
import { parse } from 'date-fns';
import { render } from 'testHelper';
import CheckInLink from 'Common/Components/CheckInLink';
import lolex, { InstalledClock } from 'lolex';
import MockAbfahrt from 'Test/client/__fixtures__/abfahrt.json';

describe('CheckInLink', () => {
  describe('TraewellingLink', () => {
    it('Renders TraewellingLink', () => {
      const { getByTestId } = render(CheckInLink, {
        type: CheckInType.Traewelling,
        abfahrt: MockAbfahrt,
      });

      getByTestId('traewellingLink');
    });

    it('Renders null if no departure', () => {
      const { queryByTestId } = render(CheckInLink, {
        type: CheckInType.Traewelling,
        abfahrt: {
          ...MockAbfahrt,
          departure: undefined,
        },
      });

      expect(queryByTestId('traewellingLink')).toBeNull();
    });

    it('Renders null if no train type', () => {
      const { queryByTestId } = render(CheckInLink, {
        type: CheckInType.Traewelling,
        abfahrt: {
          ...MockAbfahrt,
          train: {
            ...MockAbfahrt.train,
            type: '',
          },
        },
      });

      expect(queryByTestId('traewellingLink')).toBeNull();
    });

    it('Uses trainNumber by default', () => {
      const { getByTestId } = render(CheckInLink, {
        type: CheckInType.Traewelling,
        abfahrt: {
          ...MockAbfahrt,
          train: {
            ...MockAbfahrt.train,
            number: 'TestNumber',
          },
        },
      });

      const link = <HTMLAnchorElement>getByTestId('traewellingLink');

      expect(link.href).toContain('TestNumber');
    });

    it('Uses trainLine for type S', () => {
      const { getByTestId } = render(CheckInLink, {
        type: CheckInType.Traewelling,
        abfahrt: {
          ...MockAbfahrt,
          train: {
            ...MockAbfahrt.train,
            type: 'S',
            line: 'testLine',
          },
        },
      });

      const link = <HTMLAnchorElement>getByTestId('traewellingLink');

      expect(link.href).toContain('testLine');
    });
  });

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

      const { getByTestId } = render(CheckInLink, {
        type: CheckInType.Travelynx,
        abfahrt: MockAbfahrt,
      });

      getByTestId('travellynxlink');
    });
    it('Renders Travellynx if departure in 20 Minutes and arrival not existant', () => {
      clock.setSystemTime(parse('22.07.2019 14:19', 'dd.MM.yyyy HH:mm', 0));

      const { getByTestId } = render(CheckInLink, {
        type: CheckInType.Travelynx,
        abfahrt: {
          ...MockAbfahrt,
          arrival: undefined,
        },
      });

      getByTestId('travellynxlink');
    });
    it('Renders no link if arrival >30 Minutes away', () => {
      clock.setSystemTime(parse('22.07.2019 14:08', 'dd.MM.yyyy HH:mm', 0));

      const { queryByTestId } = render(CheckInLink, {
        type: CheckInType.Travelynx,
        abfahrt: MockAbfahrt,
      });

      expect(queryByTestId('travellynxlink')).toBeNull();
    });
    it('Renders link if arrival >30 Minutes but planned arrival <30', () => {
      clock.setSystemTime(parse('22.07.2019 14:19', 'dd.MM.yyyy HH:mm', 0));
      const { getByTestId } = render(CheckInLink, {
        type: CheckInType.Travelynx,
        abfahrt: {
          ...MockAbfahrt,
          arrival: {
            ...MockAbfahrt.arrival,
            time: parse('22.07.2019 17:52', 'dd.MM.yyyy HH:mm', 0).getTime(),
          },
        },
      });

      getByTestId('travellynxlink');
    });
  });

  it('Renders both', () => {
    const { getByTestId } = render(CheckInLink, {
      type: CheckInType.Both,
      abfahrt: MockAbfahrt,
    });

    getByTestId('travellynxlink');
    getByTestId('traewellingLink');
  });

  it('Renders none', () => {
    const { queryByTestId } = render(CheckInLink, {
      type: CheckInType.None,
      abfahrt: MockAbfahrt,
    });

    expect(queryByTestId('travellynxlink')).toBeNull();
    expect(queryByTestId('traewellingLink')).toBeNull();
  });
});
