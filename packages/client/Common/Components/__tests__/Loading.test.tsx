import { Loading, LoadingType } from 'client/Common/Components/Loading';
import { render } from 'client/__tests__/testHelper';
import { screen } from '@testing-library/react';

describe('Loading', () => {
  it('returns children if isLoading is false', () => {
    const { container } = render(Loading, {
      children: <div data-testid="temp" />,
    });

    expect(screen.queryByTestId('temp')).toBeDefined();
    expect(container).toMatchSnapshot();
  });

  it('shows loading instead of children if isLoading is given', () => {
    const { container } = render(Loading, {
      children: <div data-testid="temp" />,
      isLoading: true,
    });

    expect(screen.queryByTestId('temp')).toBeNull();
    expect(screen.queryByTestId('grid')).toBeVisible();
    expect(container).toMatchSnapshot();
  });

  it('shows loading if no children given', () => {
    const { container } = render(Loading);

    expect(screen.queryByTestId('grid')).toBeVisible();
    expect(container).toMatchSnapshot();
  });

  it('shows loading if no children given (dots type)', () => {
    const { container } = render(Loading, {
      type: LoadingType.dots,
    });

    expect(screen.queryByTestId('dots')).toBeVisible();
    expect(container).toMatchSnapshot();
  });

  it('supports custom className', () => {
    const { container } = render(Loading, {
      className: 'test',
    });

    expect(screen.queryByTestId('grid')).toBeVisible();
    expect(container).toHaveClass('test');
    expect(container).toMatchSnapshot();
  });

  it('defaults to grid', () => {
    const { container } = render(Loading, {
      type: 5,
    });

    expect(screen.queryByTestId('grid')).toBeVisible();
    expect(container).toMatchSnapshot();
  });
});
