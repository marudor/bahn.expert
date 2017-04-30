import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import * as React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import AbfahrtenList from './AbfahrtenList';
import FavList from './FavList';
import Header from './Header';

const Home = () => (<div>Abfahrten</div>);

const BahnhofsAbfahrten = () => (
  <Router>
    <MuiThemeProvider>
      <div style={style.wrapper}>
        <Route path="/" component={Header} />
        <Route path="/" exact={true} component={FavList} />
        <Route path="/:station" component={AbfahrtenList} />
      </div>
    </MuiThemeProvider>
  </Router>
);

export default BahnhofsAbfahrten;

const style: any = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
};
