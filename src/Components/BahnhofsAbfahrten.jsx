// @flow
import { Route, BrowserRouter as Router } from 'react-router-dom';
import AbfahrtenList from './AbfahrtenList';
import FavList from './FavList';
import Header from './Header';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import React from 'react';
import styles from './BahnhofsAbfahrten.scss';

const BahnhofsAbfahrten = () => (
  <Router>
    <MuiThemeProvider>
      <div className={styles.wrapper}>
        <Route path="/" component={Header} />
        <Route path="/" exact component={FavList} />
        <Route path="/:station" component={AbfahrtenList} />
      </div>
    </MuiThemeProvider>
  </Router>
);

export default BahnhofsAbfahrten;
