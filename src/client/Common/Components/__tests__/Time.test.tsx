import { render } from '@/client/__tests__/testHelper';
import { screen } from '@testing-library/react';
import { Time } from '@/client/Common/Components/Time';

const sampleTime = new Date('2019-06-12T13:55:37.648Z');

describe('Time', () => {
  it('no time', () => {
    const { container } = render(<Time />);

    expect(container).toBeNull();
  });
  it('only scheduled Data', () => {
    render(<Time real={sampleTime} />);

    expect(screen.queryByTestId('realTimeOrDelay')).toBeNull();
    expect(screen.queryByTestId('timeToDisplay')).toHaveTextContent('13:55');
  });

  it('10 Minutes delay', () => {
    const { container, theme } = render(<Time real={sampleTime} delay={10} />);

    expect(screen.queryByTestId('timeToDisplay')).toHaveTextContent('13:45');
    expect(screen.queryByTestId('realTimeOrDelay')).toHaveTextContent('13:55');
    expect(screen.queryByTestId('realTimeOrDelay')).toHaveStyle(
      `color: ${theme.colors.red}`,
    );
    expect(container).toMatchInlineSnapshot(`
      .emotion-1 {
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-flex-direction: column;
        -ms-flex-direction: column;
        flex-direction: column;
        font-size: 0.9em;
      }

      .emotion-2 {
        margin-right: .2em;
      }

      .emotion-4 {
        margin-right: .2em;
        color: #ff1744;
      }

      <div
        class="MuiStack-root emotion-0 emotion-1"
        data-testid="timeContainer"
      >
        <span
          class="emotion-2 emotion-3"
          data-testid="timeToDisplay"
        >
          13:45
        </span>
        <span
          class="emotion-4 emotion-3"
          data-testid="realTimeOrDelay"
        >
          13:55
        </span>
      </div>
    `);
  });

  it('5 Minutes early', () => {
    const { container, theme } = render(<Time real={sampleTime} delay={-5} />);

    expect(screen.queryByTestId('timeToDisplay')).toHaveTextContent('14:00');
    expect(screen.queryByTestId('realTimeOrDelay')).toHaveTextContent('13:55');
    expect(screen.queryByTestId('realTimeOrDelay')).toHaveStyle(
      `color: ${theme.colors.green}`,
    );
    expect(container).toMatchInlineSnapshot(`
      .emotion-1 {
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-flex-direction: column;
        -ms-flex-direction: column;
        flex-direction: column;
        font-size: 0.9em;
      }

      .emotion-2 {
        margin-right: .2em;
      }

      .emotion-4 {
        margin-right: .2em;
        color: #7cb342;
      }

      <div
        class="MuiStack-root emotion-0 emotion-1"
        data-testid="timeContainer"
      >
        <span
          class="emotion-2 emotion-3"
          data-testid="timeToDisplay"
        >
          14:00
        </span>
        <span
          class="emotion-4 emotion-3"
          data-testid="realTimeOrDelay"
        >
          13:55
        </span>
      </div>
    `);
  });

  it('shows 0 delay number', () => {
    const { container, theme } = render(<Time real={sampleTime} delay={0} />);

    expect(screen.queryByTestId('timeToDisplay')).toHaveTextContent('13:55');
    expect(screen.queryByTestId('realTimeOrDelay')).toHaveTextContent('13:55');
    expect(screen.queryByTestId('realTimeOrDelay')).toHaveStyle(
      `color: ${theme.colors.green}`,
    );
    expect(container).toMatchInlineSnapshot(`
      .emotion-1 {
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-flex-direction: column;
        -ms-flex-direction: column;
        flex-direction: column;
        font-size: 0.9em;
      }

      .emotion-2 {
        margin-right: .2em;
      }

      .emotion-4 {
        margin-right: .2em;
        color: #7cb342;
      }

      <div
        class="MuiStack-root emotion-0 emotion-1"
        data-testid="timeContainer"
      >
        <span
          class="emotion-2 emotion-3"
          data-testid="timeToDisplay"
        >
          13:55
        </span>
        <span
          class="emotion-4 emotion-3"
          data-testid="realTimeOrDelay"
        >
          13:55
        </span>
      </div>
    `);
  });
});
