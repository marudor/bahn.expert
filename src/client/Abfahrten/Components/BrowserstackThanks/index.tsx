import logo from './Browserstack-logo.svg';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import useStyles from './index.style';

const BrowserstackThanks = () => {
  const classes = useStyles();

  return (
    <span className={classes.main}>
      <a
        href="https://browserstack.com"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img width="200px" src={logo} />
      </a>
      {!global.smallScreen && <Typography>Tested on Browserstack</Typography>}
    </span>
  );
};

export default BrowserstackThanks;
