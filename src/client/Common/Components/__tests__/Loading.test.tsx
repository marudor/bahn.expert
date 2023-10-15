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
    expect(container).toMatchInlineSnapshot(`
      @keyframes animation-0 {
        0%, 70%, 100% {
          -webkit-transform: scale3d(1,1,1);
          -moz-transform: scale3d(1,1,1);
          -ms-transform: scale3d(1,1,1);
          transform: scale3d(1,1,1);
        }

        35% {
          -webkit-transform: scale3d(0,0,1);
          -moz-transform: scale3d(0,0,1);
          -ms-transform: scale3d(0,0,1);
          transform: scale3d(0,0,1);
        }
      }

      .emotion-0 {
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        width: 35vmin;
        height: 35vmin;
        margin: auto;
        position: absolute;
      }

      .emotion-0>div {
        width: 33%;
        height: 33%;
        background-color: #fff;
        float: left;
        -webkit-animation: animation-0 1.3s infinite ease-in-out;
        animation: animation-0 1.3s infinite ease-in-out;
      }

      .emotion-0>div:nth-of-type(1) {
        -webkit-animation-delay: 0.2s;
        animation-delay: 0.2s;
      }

      .emotion-0>div:nth-of-type(2) {
        -webkit-animation-delay: 0.3s;
        animation-delay: 0.3s;
      }

      .emotion-0>div:nth-of-type(3) {
        -webkit-animation-delay: 0.4s;
        animation-delay: 0.4s;
      }

      .emotion-0>div:nth-of-type(4) {
        -webkit-animation-delay: 0.1s;
        animation-delay: 0.1s;
      }

      .emotion-0>div:nth-of-type(5) {
        -webkit-animation-delay: 0.2s;
        animation-delay: 0.2s;
      }

      .emotion-0>div:nth-of-type(6) {
        -webkit-animation-delay: 0.3s;
        animation-delay: 0.3s;
      }

      .emotion-0>div:nth-of-type(7) {
        -webkit-animation-delay: 0s;
        animation-delay: 0s;
      }

      .emotion-0>div:nth-of-type(8) {
        -webkit-animation-delay: 0.1s;
        animation-delay: 0.1s;
      }

      .emotion-0>div:nth-of-type(9) {
        -webkit-animation-delay: 0.2s;
        animation-delay: 0.2s;
      }

      <div
        data-testid="loading"
      >
        <div
          class="emotion-0 emotion-1"
          data-testid="grid"
        >
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
        </div>
      </div>
    `);
  });

  it('shows loading if no children given (dots type)', () => {
    const { container } = render(<Loading type={LoadingType.dots} />);

    expect(screen.queryByTestId('dots')).toBeVisible();
    expect(container).toMatchInlineSnapshot(`
      @keyframes animation-0 {
        0% {
          top: 6px;
          height: 51px;
        }

        50%, 100% {
          top: 19px;
          height: 26px;
        }
      }

      .emotion-0 {
        display: inline-block;
        position: relative;
        width: 64px;
        height: 64px;
      }

      .emotion-0>div {
        display: inline-block;
        position: absolute;
        left: 6px;
        width: 13px;
        background: #fff;
        -webkit-animation: animation-0 1.2s cubic-bezier(0, 0.5, 0.5, 1) infinite;
        animation: animation-0 1.2s cubic-bezier(0, 0.5, 0.5, 1) infinite;
      }

      .emotion-0>div:nth-of-type(1) {
        left: 6px;
        -webkit-animation-delay: -0.24s;
        animation-delay: -0.24s;
      }

      .emotion-0>div:nth-of-type(2) {
        left: 26px;
        -webkit-animation-delay: -0.12s;
        animation-delay: -0.12s;
      }

      .emotion-0>div:nth-of-type(3) {
        left: 45px;
        -webkit-animation-delay: 0;
        animation-delay: 0;
      }

      <div
        data-testid="loading"
      >
        <div
          class="emotion-0 emotion-1"
          data-testid="dots"
        >
          <div />
          <div />
          <div />
        </div>
      </div>
    `);
  });

  it('supports custom className', () => {
    const { container } = render(<Loading className="test" />);

    expect(screen.queryByTestId('grid')).toBeVisible();
    expect(container).toHaveClass('test');
    expect(container).toMatchInlineSnapshot(`
      @keyframes animation-0 {
        0%, 70%, 100% {
          -webkit-transform: scale3d(1,1,1);
          -moz-transform: scale3d(1,1,1);
          -ms-transform: scale3d(1,1,1);
          transform: scale3d(1,1,1);
        }

        35% {
          -webkit-transform: scale3d(0,0,1);
          -moz-transform: scale3d(0,0,1);
          -ms-transform: scale3d(0,0,1);
          transform: scale3d(0,0,1);
        }
      }

      .emotion-0 {
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        width: 35vmin;
        height: 35vmin;
        margin: auto;
        position: absolute;
      }

      .emotion-0>div {
        width: 33%;
        height: 33%;
        background-color: #fff;
        float: left;
        -webkit-animation: animation-0 1.3s infinite ease-in-out;
        animation: animation-0 1.3s infinite ease-in-out;
      }

      .emotion-0>div:nth-of-type(1) {
        -webkit-animation-delay: 0.2s;
        animation-delay: 0.2s;
      }

      .emotion-0>div:nth-of-type(2) {
        -webkit-animation-delay: 0.3s;
        animation-delay: 0.3s;
      }

      .emotion-0>div:nth-of-type(3) {
        -webkit-animation-delay: 0.4s;
        animation-delay: 0.4s;
      }

      .emotion-0>div:nth-of-type(4) {
        -webkit-animation-delay: 0.1s;
        animation-delay: 0.1s;
      }

      .emotion-0>div:nth-of-type(5) {
        -webkit-animation-delay: 0.2s;
        animation-delay: 0.2s;
      }

      .emotion-0>div:nth-of-type(6) {
        -webkit-animation-delay: 0.3s;
        animation-delay: 0.3s;
      }

      .emotion-0>div:nth-of-type(7) {
        -webkit-animation-delay: 0s;
        animation-delay: 0s;
      }

      .emotion-0>div:nth-of-type(8) {
        -webkit-animation-delay: 0.1s;
        animation-delay: 0.1s;
      }

      .emotion-0>div:nth-of-type(9) {
        -webkit-animation-delay: 0.2s;
        animation-delay: 0.2s;
      }

      <div
        class="test"
        data-testid="loading"
      >
        <div
          class="emotion-0 emotion-1"
          data-testid="grid"
        >
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
        </div>
      </div>
    `);
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
