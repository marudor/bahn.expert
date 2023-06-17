import { render } from '@/client/__tests__/testHelper';
import { screen } from '@testing-library/react';
import { StopPlaceLink } from '@/client/Common/Components/StopPlaceLink';

describe('StationLink', () => {
  it('renders anchor for stationName', () => {
    render(
      <StopPlaceLink
        stopPlace={{
          name: 'test',
        }}
      />,
    );

    const anchor = screen.getByTestId('stationLink');

    expect(anchor).toHaveAttribute('href', '/test');
    expect(anchor).toHaveTextContent('test');
  });
});
