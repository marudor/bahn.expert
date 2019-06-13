import * as React from 'react';
import useStyles from './Loading.style';

type OwnProps = {
  isLoading?: boolean;
  className?: string;
  children?: React.ReactElement;
  type?: 0 | 1;
};

type Props = OwnProps;

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
        <div data-testid="grid" className={classes.cube}>
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
        <div data-testid="dots" className={classes.dots}>
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
}: Props) => {
  const classes = useStyles({});

  if (isLoading || !children) {
    return <div className={className}>{getType(type, classes)}</div>;
  }

  return children;
};

export default Loading;
