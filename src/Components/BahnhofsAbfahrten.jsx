// @flow
import { Route, BrowserRouter as Router } from 'react-router-dom';
import AbfahrtenList from './AbfahrtenList';
import FavList from './FavList';
import Header from './Header';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import React from 'react';

const BahnhofsAbfahrten = () =>
  <Router>
    <MuiThemeProvider>
      <div style={style.wrapper}>
        <Route path="/" component={Header} />
        <Route path="/" exact component={FavList} />
        <Route path="/:station" component={AbfahrtenList} />
      </div>
    </MuiThemeProvider>
  </Router>;

export default BahnhofsAbfahrten;

const style = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
};
