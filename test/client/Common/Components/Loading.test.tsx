import { render } from 'testHelper';
import Loading, { LoadingType } from 'Common/Components/Loading';
import React from 'react';

describe('Loading', () => {
  it('returns children if isLoading is false', () => {
    const { queryByTestId, container } = render(Loading, {
      children: <div data-testid="temp" />,
    });

    expect(queryByTestId('temp')).toBeDefined();
    expect(container).toMatchSnapshot();
  });

  it('shows loading instead of children if isLoading is given', () => {
    const { queryByTestId, container } = render(Loading, {
      children: <div data-testid="temp" />,
      isLoading: true,
    });

    expect(queryByTestId('temp')).toBeNull();
    expect(queryByTestId('grid')).toBeVisible();
    expect(container).toMatchSnapshot();
  });

  it('shows loading if no children given', () => {
    const { queryByTestId, container } = render(Loading);

    expect(queryByTestId('grid')).toBeVisible();
    expect(container).toMatchSnapshot();
  });

  it('shows loading if no children given (dots type)', () => {
    const { queryByTestId, container } = render(Loading, {
      type: LoadingType.dots,
    });

    expect(queryByTestId('dots')).toBeVisible();
    expect(container).toMatchSnapshot();
  });

  it('supports custom className', () => {
    const { queryByTestId, container } = render(Loading, {
      className: 'test',
    });

    expect(queryByTestId('grid')).toBeVisible();
    expect(container).toHaveClass('test');
    expect(container).toMatchSnapshot();
  });

  it('defaults to grid', () => {
    const { queryByTestId, container } = render(Loading, {
      type: 5,
    });

    expect(queryByTestId('grid')).toBeVisible();
    expect(container).toMatchSnapshot();
  });
});
