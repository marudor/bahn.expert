import { AppBar, Toolbar } from '@material-ui/core';
import { format } from 'date-fns';
import ActionMenu from '@material-ui/icons/Menu';
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
        <IconButton aria-label="Menu" onClick={toggleDrawer} color="inherit">
          <ActionMenu color="inherit" />
        </IconButton>
        <div className={classes.train}>
          <span>{trainText}</span>
          {details && <span>{format(details.departure.time, 'dd.MM')}</span>}
        </div>

        {details && (
          <div className={classes.destination}>
            <span> -&gt; </span>
            <span>{details.segmentDestination.title}</span>
          </div>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
