import { DetailVia } from 'client/Abfahrten/Components/Abfahrt/Via/Detail';
import { InnerAbfahrtenConfigProvider } from 'client/Abfahrten/provider/AbfahrtenConfigProvider';
import { render } from 'client/__tests__/testHelper';

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
    const { getByTestId, theme } = render(
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
      }
    );

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
