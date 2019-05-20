import cc from 'classnames';
import React from 'react';
import useStyles from './Platform.style';

type OwnProps = {
  className?: string;
  cancelled?: boolean;
  scheduled?: string;
  real?: string;
};
type Props = OwnProps;

const Platform = ({ className, cancelled, scheduled, real }: Props) => {
  const classes = useStyles();

  return (
    <span
      className={cc(className, {
        [classes.cancelled]: cancelled,
        [classes.changed]: scheduled && scheduled !== real,
      })}
    >
      {real}
    </span>
  );
};

export default Platform;
