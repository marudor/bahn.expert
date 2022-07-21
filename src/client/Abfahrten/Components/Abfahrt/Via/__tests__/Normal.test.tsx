import { NormalVia } from 'client/Abfahrten/Components/Abfahrt/Via/Normal';
import { render } from 'client/__tests__/testHelper';
import { screen } from '@testing-library/react';

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
    const { theme } = render(<NormalVia stops={mockStops} />);

    const additional = screen.getByTestId('via-additional');

    expect(additional).not.toHaveAttribute('href', 'additional');
    expect(additional).toHaveStyle(`color: ${theme.colors.green}`);

    expect(screen.queryByTestId('via-cancelled')).toBeNull();

    const hbf = screen.getByTestId('via-hbf');

    expect(hbf).not.toHaveAttribute('href', 'hbf');
    expect(hbf).toHaveStyle('font-weight: bold');
    expect(hbf).toMatchInlineSnapshot(`
      .emotion-0 {
        color: #fff;
        font-weight: bold;
      }

      <span
        class="emotion-0"
        data-testid="via-hbf"
      >
        hbf
      </span>
    `);
  });
});
