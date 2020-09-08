import { makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import type { FC } from 'react';

const useStyles = makeStyles((theme) => ({
  cancelled: theme.mixins.cancelled,
  changed: theme.mixins.changed,
  changedWrapper: {
    ...theme.mixins.cancelled,
    paddingLeft: '.3em',
  },
}));

interface Props {
  className?: string;
  cancelled?: boolean;
  scheduled?: string;
  real?: string;
}

export const Platform: FC<Props> = ({
  className,
  cancelled,
  scheduled,
  real,
}) => {
  const classes = useStyles();
  const changed = Boolean(scheduled && scheduled !== real);

  return (
    <div
      data-testid="platform"
      className={clsx(className, {
        [classes.cancelled]: cancelled,
        [classes.changed]: changed,
      })}
    >
      <span data-testid="real">{real}</span>
      {changed && (
        <span className={classes.changedWrapper} data-testid="scheduled">
          ({scheduled})
        </span>
      )}
    </div>
  );
};
