import { render } from 'client/__tests__/testHelper';
import { RouteHeader } from 'client/Routing/Components/RouteList/RouteHeader';
import { screen } from '@testing-library/react';

describe('RouteHeader', () => {
  it('renders date in header', () => {
    render(RouteHeader, {
      date: new Date('2019-10-19T00:00:00.000Z'),
    });

    expect(screen.queryByTestId('headerDate')).toHaveTextContent('19.10.2019');
  });
});
