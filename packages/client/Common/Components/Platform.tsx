import { makeStyles } from '@material-ui/core';
import clsx from 'clsx';

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

export const Platform = ({ className, cancelled, scheduled, real }: Props) => {
  const classes = useStyles();
  const changed = Boolean(scheduled && scheduled !== real);

  return (
    <div
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
