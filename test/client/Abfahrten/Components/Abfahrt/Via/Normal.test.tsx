import { render } from 'testHelper';
import NormalVia from 'Abfahrten/Components/Abfahrt/Via/Normal';

describe('NormalVia', () => {
  const mockStops = [
    {
      name: 'first',
    },
    {
      name: 'additional',
      additional: true,
      showVia: true,
    },
    {
      name: 'cancelled',
      cancelled: true,
    },
    {
      name: 'hbf',
      showVia: true,
    },
    {
      name: 'last',
    },
  ];

  it('Renders Via are not links', () => {
    const { queryByTestId, getByTestId, theme } = render(NormalVia, {
      stops: mockStops,
    });

    const additional = getByTestId('via-additional');

    expect(additional).not.toHaveAttribute('href', 'additional');
    expect(additional).toHaveStyle(`color: ${theme.colors.green}`);

    expect(queryByTestId('via-cancelled')).toBeNull();

    const hbf = getByTestId('via-hbf');

    expect(hbf).not.toHaveAttribute('href', 'hbf');
    expect(hbf).toHaveStyle('font-weight: bold');
  });
});
