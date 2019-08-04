import { AppBar, Toolbar } from '@material-ui/core';
import ActionHome from '@material-ui/icons/Home';
import DetailsContext from './DetailsContext';
import IconButton from '@material-ui/core/IconButton';
import NavigationContext from 'Common/Components/Navigation/NavigationContext';
import React, { useContext } from 'react';
import useStyles from './Header.style';

interface Props {
  train: string;
}
const Header = ({ train }: Props) => {
  const classes = useStyles();
  const { toggleDrawer } = useContext(NavigationContext);
  const { details } = useContext(DetailsContext);

  const trainText = details ? details.train.name : train;

  return (
    <AppBar position="fixed">
      <Toolbar disableGutters className={classes.toolbar}>
        <IconButton aria-label="Home" onClick={toggleDrawer} color="inherit">
          <ActionHome color="inherit" />
        </IconButton>
        <span>{trainText}</span>
        {details && (
          <div className={classes.train}>
            <span> -&gt; </span>
            <span>{details.segmentDestination.title}</span>
          </div>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
