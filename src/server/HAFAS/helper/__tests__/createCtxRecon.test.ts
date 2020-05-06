import { parse } from 'date-fns';
import createCtxRecon from 'server/HAFAS/helper/createCtxRecon';
import type {
  Route$ValidArrivalStop,
  Route$ValidDepartureStop,
} from 'types/HAFAS/JourneyDetails';

describe('createCtxRecon', () => {
  const expectedDeparture = '201912131045';
  const expectedArrival = '201912131220';
  const departureTime = parse(expectedDeparture, 'yyyyMMddHHmm', 0);
  const arrivalTime = parse(expectedArrival, 'yyyyMMddHHmm', 0);

  const firstStop: Route$ValidDepartureStop = {
    station: {
      id: '123',
      title: 'dummy',
    },
    departure: {
      scheduledTime: departureTime.getTime(),
      time: departureTime.getTime(),
    },
  };

  const lastStop: Route$ValidArrivalStop = {
    station: {
      id: '321',
      title: 'otherDummy',
    },
    arrival: {
      scheduledTime: arrivalTime.getTime(),
      time: arrivalTime.getTime() + 123456,
    },
  };

  it('Default replacementNumber is one', () => {
    expect(
      createCtxRecon({
        firstStop,
        lastStop,
        trainName: 'test',
      })
    ).toBe(
      `¶HKI¶T$A=1@L=${firstStop.station.id}@a=128@$A=1@L=${lastStop.station.id}@a=128@$${expectedDeparture}$${expectedArrival}$test$$1$`
    );
  });

  it('Ersatzfahrt has replacement 2', () => {
    expect(
      createCtxRecon({
        firstStop,
        lastStop,
        trainName: 'ersatz',
        messages: [
          {
            type: '',
            code: '',
            icoX: 0,
            txtN: 'Ersatzfahrt',
          },
        ],
      })
    ).toBe(
      `¶HKI¶T$A=1@L=${firstStop.station.id}@a=128@$A=1@L=${lastStop.station.id}@a=128@$${expectedDeparture}$${expectedArrival}$ersatz$$2$`
    );
  });
});
