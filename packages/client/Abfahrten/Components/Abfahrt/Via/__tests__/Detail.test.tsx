import { DetailVia } from 'client/Abfahrten/Components/Abfahrt/Via/Detail';
import { InnerAbfahrtenConfigProvider } from 'client/Abfahrten/provider/AbfahrtenConfigProvider';
import { render } from 'client/__tests__/testHelper';
import { screen } from '@testing-library/react';

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
    const { theme } = render(
      DetailVia,
      {
        stops: mockStops,
      },
      {
        provider: [
          {
            Provider: InnerAbfahrtenConfigProvider,
            initialState: {
              initialState: {
                filter: {},
                config: {},
              },
            },
          },
        ],
      },
    );

    const additional = screen.getByTestId('via-additional');

    expect(additional).toHaveAttribute('href', '/additional');
    expect(additional).toHaveStyle(`color: ${theme.colors.green}`);

    const cancelled = screen.getByTestId('via-cancelled');

    expect(cancelled).toHaveAttribute('href', '/cancelled');
    expect(cancelled).toHaveStyle(`color: ${theme.colors.red}`);

    const hbf = screen.getByTestId('via-hbf');

    expect(hbf).toHaveAttribute('href', '/hbf');
    expect(hbf).toHaveStyle('font-weight: bold');
  });
});
