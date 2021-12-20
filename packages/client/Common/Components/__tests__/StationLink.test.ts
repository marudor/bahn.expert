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
});
