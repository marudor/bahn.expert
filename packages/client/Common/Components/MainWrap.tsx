import { makeStyles } from '@material-ui/core';
import { ReactNode } from 'react';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
  noHeader: {
    marginTop: -theme.shape.headerSpacing,
  },
  wrap: {
    display: 'flex',
    flexDirection: 'column',
  },
}));

interface Props {
  noHeader?: boolean;
  children: ReactNode;
}

export const MainWrap = ({ noHeader, children }: Props) => {
  const classes = useStyles();
  return (
    <div className={clsx(classes.wrap, noHeader && classes.noHeader)}>
      {children}
    </div>
  );
};
