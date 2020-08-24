import { Platform } from 'client/Common/Components/Platform';
import { render } from 'client/__tests__/testHelper';

describe('Platform', () => {
  it('No platform provided', () => {
    const { container, queryByTestId } = render(Platform);

    expect(queryByTestId('real')).toBeEmptyDOMElement();
    expect(container).toMatchSnapshot();
  });
  it('scheduled === real', () => {
    const { container, queryByTestId } = render(Platform, {
      real: '1',
      scheduled: '1',
    });

    expect(queryByTestId('real')).toHaveTextContent('1');
    expect(queryByTestId('scheduled')).toBeNull();
    expect(container).toMatchSnapshot();
  });
  it('scheduled === real & cancelled', () => {
    const { container, queryByTestId } = render(Platform, {
      real: '1',
      scheduled: '1',
      cancelled: true,
    });

    expect(queryByTestId('real')).toHaveTextContent('1');
    expect(container).toHaveStyle('text-decoration: line-through');
    expect(container).toMatchSnapshot();
  });
  it('scheduled !== real & cancelled', () => {
    const { container, theme, queryByTestId } = render(Platform, {
      real: '1',
      scheduled: '2',
      cancelled: true,
    });

    expect(queryByTestId('real')).toHaveTextContent('1');
    expect(container).toHaveStyle(`
    text-decoration: line-through;
    color: ${theme.colors.red};`);
    expect(container).toMatchSnapshot();
  });
  it('scheduled !== real', () => {
    const { container, theme, queryByTestId } = render(Platform, {
      real: '1',
      scheduled: '2',
    });

    expect(queryByTestId('real')).toHaveTextContent('1');
    expect(queryByTestId('scheduled')).toHaveTextContent('2');
    expect(queryByTestId('scheduled')).toHaveStyle(
      'text-decoration: line-through;',
    );
    expect(container).not.toHaveStyle(`text-decoration: line-through;`);
    expect(container).toHaveStyle(`color: ${theme.colors.red};`);
    expect(container).toMatchSnapshot();
  });
});
