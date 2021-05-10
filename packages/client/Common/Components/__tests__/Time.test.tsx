import { render } from 'client/__tests__/testHelper';
import { screen } from '@testing-library/react';
import { Time } from 'client/Common/Components/Time';

const sampleTime = new Date('2019-06-12T13:55:37.648Z');

describe('Time', () => {
  it('no time', () => {
    const { container } = render(Time);

    expect(container).toBeNull();
    expect(container).toMatchSnapshot();
  });
  it('only scheduled Data', () => {
    render(Time, {
      real: sampleTime,
    });

    expect(screen.queryByTestId('delay')).toBeNull();
    expect(screen.queryByTestId('time')).toHaveTextContent('13:55');
  });

  describe('showOriginalTime = false', () => {
    it('10 Minutes delay', () => {
      const { container, theme } = render(Time, {
        real: sampleTime,
        delay: 10,
      });

      expect(screen.queryByTestId('time')).toHaveTextContent('13:55');
      expect(screen.queryByTestId('delay')).toHaveTextContent('+10');
      expect(container).toHaveStyle(`color: ${theme.colors.red}`);
      expect(container).toMatchSnapshot();
    });

    it('5 Minutes early', () => {
      const { container, theme } = render(Time, {
        real: sampleTime,
        delay: -5,
      });

      expect(screen.queryByTestId('time')).toHaveTextContent('13:55');
      expect(screen.queryByTestId('delay')).toHaveTextContent('-5');
      expect(container).toHaveStyle(`color: ${theme.colors.green}`);
      expect(container).toMatchSnapshot();
    });
  });

  describe('showOriginalTime = true', () => {
    it('10 Minutes delay', () => {
      const { container, theme } = render(
        Time,
        {
          real: sampleTime,
          delay: 10,
        },
        {
          commonConfig: {
            time: false,
          },
        },
      );

      expect(screen.queryByTestId('time')).toHaveTextContent('13:45');
      expect(screen.queryByTestId('delay')).toHaveTextContent('+10');
      expect(container).not.toHaveStyle(`color: ${theme.colors.red}`);
      expect(container).toMatchSnapshot();
    });

    it('5 Minutes early', () => {
      const { container, theme } = render(
        Time,
        {
          real: sampleTime,
          delay: -5,
        },
        {
          commonConfig: {
            time: false,
          },
        },
      );

      expect(screen.queryByTestId('time')).toHaveTextContent('14:00');
      expect(screen.queryByTestId('delay')).toHaveTextContent('-5');
      expect(container).not.toHaveStyle(`color: ${theme.colors.green}`);
      expect(container).toMatchSnapshot();
    });
  });

  it('shows 0 delay number', () => {
    const { container, theme } = render(Time, {
      real: sampleTime,
      delay: 0,
    });

    expect(screen.queryByTestId('time')).toHaveTextContent('13:55');
    expect(screen.queryByTestId('delay')).toHaveTextContent('0');
    expect(container).toHaveStyle(`color: ${theme.colors.green}`);
    expect(container).toMatchSnapshot();
  });

  it('does not show 0 delay number', () => {
    const { container, theme } = render(Time, {
      real: sampleTime,
      delay: 0,
      showZero: false,
    });

    expect(screen.queryByTestId('time')).toHaveTextContent('13:55');
    expect(screen.queryByTestId('delay')).toBeNull();
    expect(container).not.toHaveStyle(`color: ${theme.colors.green}`);
    expect(container).not.toHaveStyle(`color: ${theme.colors.red}`);
    expect(container).toMatchSnapshot();
  });
});
