import { render } from 'test-helper';
import Time from 'Common/Components/Time';

// 2019-06-12T13:55:37.648Z
const sampleTime = 1560347737648;

describe('Time', () => {
  it('no time', () => {
    const { container } = render(Time);

    expect(container).toBeNull();
    expect(container).toMatchSnapshot();
  });
  it('only scheduled Data', () => {
    const { queryByTestId } = render(Time, {
      real: sampleTime,
    });

    expect(queryByTestId('delay')).toBeNull();
    expect(queryByTestId('time')).toHaveTextContent('13:55');
  });

  describe('showOriginalTime = false', () => {
    it('10 Minutes delay', () => {
      const { queryByTestId, container, theme } = render(Time, {
        real: sampleTime,
        delay: 10,
      });

      expect(queryByTestId('time')).toHaveTextContent('13:55');
      expect(queryByTestId('delay')).toHaveTextContent('+10');
      expect(container).toHaveStyle(`color: ${theme.colors.red}`);
      expect(container).toMatchSnapshot();
    });

    it('5 Minutes early', () => {
      const { queryByTestId, container, theme } = render(Time, {
        real: sampleTime,
        delay: -5,
      });

      expect(queryByTestId('time')).toHaveTextContent('13:55');
      expect(queryByTestId('delay')).toHaveTextContent('-5');
      expect(container).toHaveStyle(`color: ${theme.colors.green}`);
      expect(container).toMatchSnapshot();
    });
  });

  describe('showOriginalTime = true', () => {
    it('10 Minutes delay', () => {
      const { queryByTestId, container, theme } = render(
        Time,
        {
          real: sampleTime,
          delay: 10,
        },
        {
          commonConfig: {
            time: false,
          },
        }
      );

      expect(queryByTestId('time')).toHaveTextContent('13:45');
      expect(queryByTestId('delay')).toHaveTextContent('+10');
      expect(container).not.toHaveStyle(`color: ${theme.colors.red}`);
      expect(container).toMatchSnapshot();
    });

    it('5 Minutes early', () => {
      const { queryByTestId, container, theme } = render(
        Time,
        {
          real: sampleTime,
          delay: -5,
        },
        {
          commonConfig: {
            time: false,
          },
        }
      );

      expect(queryByTestId('time')).toHaveTextContent('14:00');
      expect(queryByTestId('delay')).toHaveTextContent('-5');
      expect(container).not.toHaveStyle(`color: ${theme.colors.green}`);
      expect(container).toMatchSnapshot();
    });
  });

  it('shows 0 delay number', () => {
    const { queryByTestId, container, theme } = render(Time, {
      real: sampleTime,
      delay: 0,
    });

    expect(queryByTestId('time')).toHaveTextContent('13:55');
    expect(queryByTestId('delay')).toHaveTextContent('0');
    expect(container).toHaveStyle(`color: ${theme.colors.green}`);
    expect(container).toMatchSnapshot();
  });

  it('does not show 0 delay number', () => {
    const { queryByTestId, container, theme } = render(Time, {
      real: sampleTime,
      delay: 0,
      showZero: false,
    });

    expect(queryByTestId('time')).toHaveTextContent('13:55');
    expect(queryByTestId('delay')).toBeNull();
    expect(container).not.toHaveStyle(`color: ${theme.colors.green}`);
    expect(container).not.toHaveStyle(`color: ${theme.colors.red}`);
    expect(container).toMatchSnapshot();
  });
});
