import { render } from 'client/__tests__/testHelper';
import { screen } from '@testing-library/react';
import { StationLink } from 'client/Common/Components/StationLink';

describe('StationLink', () => {
  it('renders anchor for stationName', () => {
    render(StationLink, {
      stationName: 'test',
    });

    const anchor = screen.getByTestId('stationLink');

    expect(anchor).toHaveAttribute('href', '/test');
    expect(anchor).toHaveTextContent('test');
  });

  it('passes extra props', () => {
    render(StationLink, {
      stationName: 'test',
      // @ts-expect-error just for test
      extra: 1,
    });

    expect(screen.queryByTestId('stationLink')).toHaveAttribute('extra', '1');
  });
});
