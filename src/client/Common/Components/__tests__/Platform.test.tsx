import { Platform } from 'client/Common/Components/Platform';
import { render } from 'client/__tests__/testHelper';
import { screen } from '@testing-library/react';

describe('Platform', () => {
  it('No platform provided', () => {
    const { container } = render(<Platform />);

    expect(screen.queryByTestId('real')).toBeEmptyDOMElement();
    expect(container).toMatchSnapshot();
  });
  it('scheduled === real', () => {
    const { container } = render(<Platform real="1" scheduled="1" />);

    expect(screen.queryByTestId('real')).toHaveTextContent('1');
    expect(screen.queryByTestId('scheduled')).toBeNull();
    expect(container).toMatchSnapshot();
  });
  it('scheduled === real & cancelled', () => {
    const { container } = render(<Platform real="1" scheduled="1" cancelled />);

    expect(screen.queryByTestId('real')).toHaveTextContent('1');
    expect(container).toHaveStyle('text-decoration: line-through');
    expect(container).toMatchSnapshot();
  });
  it('scheduled !== real & cancelled', () => {
    const { container, theme } = render(
      <Platform real="1" scheduled="2" cancelled />,
    );

    expect(screen.queryByTestId('real')).toHaveTextContent('1');
    expect(container).toHaveStyle(`
    text-decoration: line-through;
    color: ${theme.colors.red};`);
    expect(container).toMatchSnapshot();
  });
  it('scheduled !== real', () => {
    const { container, theme } = render(<Platform real="1" scheduled="2" />);

    expect(screen.queryByTestId('real')).toHaveTextContent('1');
    expect(screen.queryByTestId('scheduled')).toHaveTextContent('2');
    expect(screen.queryByTestId('scheduled')).toHaveStyle(
      'text-decoration: line-through;',
    );
    expect(container).not.toHaveStyle(`text-decoration: line-through;`);
    expect(container).toHaveStyle(`color: ${theme.colors.red};`);
    expect(container).toMatchSnapshot();
  });
});
