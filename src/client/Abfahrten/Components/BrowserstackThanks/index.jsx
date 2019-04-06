// @flow
import logo from './Browserstack-logo.svg';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import withStyles, { type StyledProps } from 'react-jss';

type Props = StyledProps<{||}, typeof styles>;

const BrowserstackThanks = ({ classes }: Props) => (
  <span className={classes.main}>
    <a href="https://browserstack.com" target="_blank" rel="noopener noreferrer">
      <img width="200px" src={logo} />
    </a>
    {!global.smallScreen && <Typography>Tested on Browserstack</Typography>}
  </span>
);

export const styles = {
  main: {
    marginTop: '2em',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
};

export default React.memo<{||}>(withStyles(styles)(BrowserstackThanks));
