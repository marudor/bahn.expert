import { Loading, LoadingType } from '@/client/Common/Components/Loading';
import { render } from '@/client/__tests__/testHelper';
import { screen } from '@testing-library/react';
import type { FC, ReactNode } from 'react';

interface DummyProps {
  content?: ReactNode;
}
const DummyComponent: FC<DummyProps> = ({ content }) => (
  <div data-testid="dummy">{content}</div>
);

describe('Loading', () => {
  it('shows loading if no children given', () => {
    const { container } = render(<Loading />);

    expect(screen.queryByTestId('grid')).toBeVisible();
    expect(container).toMatchSnapshot();
  });

  it('shows loading if no children given (dots type)', () => {
    const { container } = render(<Loading type={LoadingType.dots} />);

    expect(screen.queryByTestId('dots')).toBeVisible();
    expect(container).toMatchSnapshot();
  });

  it('supports custom className', () => {
    const { container } = render(<Loading className="test" />);

    expect(screen.queryByTestId('grid')).toBeVisible();
    expect(container).toHaveClass('test');
    expect(container).toMatchSnapshot();
  });

  it('shows children if check is true', () => {
    render(<Loading check>{() => <DummyComponent />}</Loading>);
    expect(screen.getByTestId('dummy')).toBeInTheDocument();
    expect(screen.queryByTestId('loading')).toBeNull();
  });

  it('calls children with check variable', () => {
    render(
      <Loading check="content">
        {(content) => <DummyComponent content={content} />}
      </Loading>,
    );

    expect(screen.getByTestId('dummy')).toHaveTextContent('content');
  });
});
