// @flow
import './index.scss';
import logo from './Browserstack-logo.svg';
import React from 'react';

const BrowserstackThanks = () => (
  <span className="browserstack">
    <a href="https://browserstack.com" target="_blank" rel="noopener noreferrer">
      <img width="200px" src={logo} />
    </a>
    {!global.smallScreen && 'Tested on Browserstack'}
  </span>
);

export default BrowserstackThanks;
