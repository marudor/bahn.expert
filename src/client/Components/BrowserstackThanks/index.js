// @flow
import './index.scss';
import logo from './Browserstack-logo.svg';
import React from 'react';
import Typography from '@material-ui/core/Typography';

const BrowserstackThanks = () => (
  <span className="browserstack">
    <a href="https://browserstack.com" target="_blank" rel="noopener noreferrer">
      <img width="200px" src={logo} />
    </a>
    {!global.smallScreen && <Typography>Tested on Browserstack</Typography>}
  </span>
);

export default React.memo<{||}>(BrowserstackThanks);
