import { render } from 'client/__tests__/testHelper';
import { StationLink } from 'client/Common/Components/StationLink';

describe('StationLink', () => {
  it('renders anchor for stationName', () => {
    const { getByTestId } = render(StationLink, {
      stationName: 'test',
    });

    const anchor = getByTestId('stationLink');

    expect(anchor).toHaveAttribute('href', '/test');
    expect(anchor).toHaveTextContent('test');
  });

  it('passes extra props', () => {
    const { queryByTestId } = render(StationLink, {
      stationName: 'test',
      // @ts-expect-error just for test
      extra: 1,
    });

    expect(queryByTestId('stationLink')).toHaveAttribute('extra', '1');
  });
});
