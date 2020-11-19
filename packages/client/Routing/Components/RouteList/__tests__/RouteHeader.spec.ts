import { render } from 'client/__tests__/testHelper';
import { RouteHeader } from 'client/Routing/Components/RouteList/RouteHeader';

describe('RouteHeader', () => {
  it('renders date in header', () => {
    const { queryByTestId } = render(RouteHeader, {
      date: new Date('2019-10-19T00:00:00.000Z'),
    });

    expect(queryByTestId('headerDate')).toHaveTextContent('19.10.2019');
  });
});
