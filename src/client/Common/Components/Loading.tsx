import * as React from 'react';
import cc from 'clsx';
import useStyles from './Loading.style';

type OwnProps = {
  isLoading?: boolean;
  className?: string;
  children?: React.ReactElement;
  type?: LoadingType;
  relative?: boolean;
};

type Props = OwnProps;

export enum LoadingType {
  grid,
  dots,
}

function getType<C extends Record<'cube' | 'dots' | 'absolute', string>>(
  type: LoadingType,
  classes: C,
  absolute: boolean = true
) {
  switch (type) {
    default:
    case LoadingType.grid:
      return (
        <div
          data-testid="grid"
          className={cc(classes.cube, absolute && classes.absolute)}
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
  relative = false,
  type = LoadingType.grid,
}: Props) => {
  const classes = useStyles({});

  if (isLoading || !children) {
    return <div className={className}>{getType(type, classes, !relative)}</div>;
  }

  return children;
};

export default Loading;
