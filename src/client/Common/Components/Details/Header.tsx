import { AppBar, Toolbar } from '@material-ui/core';
import DetailsContext from './DetailsContext';
import HamburgerMenu from './HamburgerMenu';
import React, { useContext } from 'react';
import useStyles from './Header.style';

interface Props {
  train: string;
}
const Header = ({ train }: Props) => {
  const classes = useStyles();
  const { details } = useContext(DetailsContext);

  const trainText = details ? details.train.name : train;

  return (
    <AppBar position="fixed">
      <Toolbar disableGutters className={classes.toolbar}>
        <span>{trainText}</span>
        {details && (
          <div className={classes.train}>
            <span> -&gt; </span>
            <span>{details.segmentDestination.title}</span>
          </div>
        )}
        <HamburgerMenu />
      </Toolbar>
    </AppBar>
  );
};

export default Header;
