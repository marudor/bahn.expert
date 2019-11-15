import cc from 'clsx';
import React from 'react';
import useStyles from './Platform.style';

interface Props {
  className?: string;
  cancelled?: boolean;
  scheduled?: string;
  real?: string;
}

const Platform = ({ className, cancelled, scheduled, real }: Props) => {
  const classes = useStyles();
  const changed = scheduled && scheduled !== real;

  return (
    <div
      className={cc(className, {
        [classes.cancelled]: cancelled,
        [classes.changed]: changed,
      })}
    >
      <span data-testid="real">{real}</span>
      {changed && (
        <span
          data-testid="scheduled"
          className={cc(classes.changedWrapper, classes.cancelled)}
        >
          ({scheduled})
        </span>
      )}
    </div>
  );
};

export default Platform;
