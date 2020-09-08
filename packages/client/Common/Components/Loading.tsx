import { makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import type { FC, ReactElement } from 'react';

const useStyles = makeStyles((theme) => ({
  absolute: {
    position: 'absolute',
  },
  '@keyframes grid': {
    '0%,70%,100%': {
      transform: 'scale3D(1, 1, 1)',
    },
    '35%': {
      transform: 'scale3D(0, 0, 1)',
    },
  },
  grid: {
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: '35vmin',
    height: '35vmin',
    margin: 'auto',
    '& > div': {
      width: '33%',
      height: '33%',
      backgroundColor: theme.palette.text.primary,
      float: 'left',
      animation: '$grid 1.3s infinite ease-in-out',
    },
    '& > div:nth-child(1)': { animationDelay: '0.2s' },
    '& > div:nth-child(2)': { animationDelay: '0.3s' },
    '& > div:nth-child(3)': { animationDelay: '0.4s' },
    '& > div:nth-child(4)': { animationDelay: '0.1s' },
    '& > div:nth-child(5)': { animationDelay: '0.2s' },
    '& > div:nth-child(6)': { animationDelay: '0.3s' },
    '& > div:nth-child(7)': { animationDelay: '0s' },
    '& > div:nth-child(8)': { animationDelay: '0.1s' },
    '& > div:nth-child(9)': { animationDelay: '0.2s' },
  },
  '@keyframes dots': {
    '0%': {
      top: 6,
      height: 51,
    },
    '50%,100%': {
      top: 19,
      height: 26,
    },
  },
  dots: {
    display: 'inline-block',
    position: 'relative',
    width: 64,
    height: 64,
    '& > div': {
      display: 'inline-block',
      position: 'absolute',
      left: 6,
      width: 13,
      background: theme.palette.text.primary,
      animation: '$dots 1.2s cubic-bezier(0, 0.5, 0.5, 1) infinite',
    },
    '& > div:nth-child(1)': {
      left: 6,
      animationDelay: '-0.24s',
    },
    '& > div:nth-child(2)': {
      left: 26,
      animationDelay: '-0.12s',
    },
    '& > div:nth-child(3)': {
      left: 45,
      animationDelay: '0',
    },
  },
}));

interface Props {
  isLoading?: boolean;
  className?: string;
  type?: LoadingType;
  relative?: boolean;
  children?: ReactElement;
}

export const enum LoadingType {
  grid,
  dots,
}

const InnerLoading = ({ type, relative }: Pick<Props, 'type' | 'relative'>) => {
  const classes = useStyles();
  switch (type) {
    default:
    case LoadingType.grid:
      return (
        <div
          className={clsx(classes.grid, !relative && classes.absolute)}
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
      );
    case LoadingType.dots:
      return (
        <div className={classes.dots} data-testid="dots">
          <div />
          <div />
          <div />
        </div>
      );
  }
};

export const Loading: FC<Props> = ({
  isLoading,
  className,
  children,
  relative = false,
  type = LoadingType.grid,
}) => {
  if (isLoading || !children) {
    return (
      <div data-testid="loading" className={className}>
        <InnerLoading type={type} relative={relative} />
      </div>
    );
  }

  return children;
};
