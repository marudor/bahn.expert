import * as React from 'react';
import { createStyles, withStyles, WithStyles } from '@material-ui/styles';

type OwnProps = {
  isLoading?: boolean;
  className?: string;
  children?: React.ReactElement;
  type?: 0 | 1;
};

type Props = OwnProps & WithStyles<typeof styles>;

export enum LoadingType {
  grid,
  dots,
}

function getType<C extends Record<'cube' | 'dots', string>>(
  type: LoadingType,
  classes: C
) {
  switch (type) {
    default:
    case LoadingType.grid:
      return (
        <div className={classes.cube}>
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
        <div className={classes.dots}>
          <div />
          <div />
          <div />
        </div>
      );
  }
}

const Loading = ({
  isLoading,
  className,
  children,
  type = LoadingType.grid,
  classes,
}: Props) => {
  if (isLoading || !children) {
    return <div className={className}>{getType(type, classes)}</div>;
  }

  return children;
};

export const styles = createStyles({
  '@keyframes cube': {
    '0%,70%,100%': {
      transform: 'scale3D(1, 1, 1)',
    },
    '35%': {
      transform: 'scale3D(0, 0, 1)',
    },
  },
  cube: {
    position: 'absolute',
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
      backgroundColor: '#333',
      float: 'left',
      animation: '$cube 1.3s infinite ease-in-out',
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
      background: '#000',
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
});

const ws = withStyles(styles)(Loading);

export default React.memo(ws);
