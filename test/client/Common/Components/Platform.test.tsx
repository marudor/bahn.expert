import { render } from 'testHelper';
import Platform from 'Common/Components/Platform';

describe('Platform', () => {
  it('No platform provided', () => {
    const { container } = render(Platform);

    expect(container).toBeEmpty();
    expect(container).toMatchSnapshot();
  });
  it('scheduled === real', () => {
    const { container } = render(Platform, {
      real: '1',
      scheduled: '1',
    });

    expect(container.innerHTML).toBe('1');
    expect(container).toMatchSnapshot();
  });
  it('scheduled === real & cancelled', () => {
    const { container } = render(Platform, {
      real: '1',
      scheduled: '1',
      cancelled: true,
    });

    expect(container.innerHTML).toBe('1');
    expect(container).toHaveStyle('text-decoration: line-through');
    expect(container).toMatchSnapshot();
  });
  it('scheduled !== real & cancelled', () => {
    const { container, theme } = render(Platform, {
      real: '1',
      scheduled: '2',
      cancelled: true,
    });

    expect(container.innerHTML).toBe('1');
    expect(container).toHaveStyle(`
    text-decoration: line-through;
    color: ${theme.colors.red};`);
    expect(container).toMatchSnapshot();
  });
  it('scheduled !== real', () => {
    const { container, theme } = render(Platform, {
      real: '1',
      scheduled: '2',
    });

    expect(container.innerHTML).toBe('1');
    expect(container).not.toHaveStyle(`text-decoration: line-through;`);
    expect(container).toHaveStyle(`color: ${theme.colors.red};`);
    expect(container).toMatchSnapshot();
  });
});
