import { makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import type { FC, ReactNode } from 'react';

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

export const MainWrap: FC<Props> = ({ noHeader, children }) => {
  const classes = useStyles();
  return (
    <div className={clsx(classes.wrap, noHeader && classes.noHeader)}>
      {children}
    </div>
  );
};
