import { render } from 'testHelper';
import DetailVia from 'Abfahrten/Components/Abfahrt/Via/Detail';

describe('DetailVia', () => {
  const mockStops = [
    {
      name: 'first',
    },
    {
      name: 'additional',
      additional: true,
    },
    {
      name: 'cancelled',
      cancelled: true,
    },
    {
      name: 'hbf',
    },
    {
      name: 'last',
    },
  ];

  it('Renders Via as links', () => {
    const { getByTestId, theme } = render(DetailVia, {
      stops: mockStops,
    });

    const additional = getByTestId('via-additional');

    expect(additional).toHaveAttribute('href', '/additional');
    expect(additional).toHaveStyle(`color: ${theme.colors.green}`);

    const cancelled = getByTestId('via-cancelled');

    expect(cancelled).toHaveAttribute('href', '/cancelled');
    expect(cancelled).toHaveStyle(`color: ${theme.colors.red}`);

    const hbf = getByTestId('via-hbf');

    expect(hbf).toHaveAttribute('href', '/hbf');
    expect(hbf).toHaveStyle('font-weight: bold');
  });
});
