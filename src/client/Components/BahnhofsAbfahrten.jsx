// @flow
import './BahnhofsAbfahrten.scss';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { hot } from 'react-hot-loader';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import AbfahrtenList from './AbfahrtenList';
import FavList from './FavList';
import Header from './Header';
import React from 'react';
import SettingsModal from './SettingsModal';
// import Privacy from './Privacy';

const theme = createMuiTheme({
  overrides: {
    MuiFormControlLabel: {
      root: {
        marginLeft: 0,
        justifyContent: 'space-between',
      },
    },
  },
  type: 'dark',
  typography: {
    useNextVariants: true,
  },
});

const BahnhofsAbfahrten = () => (
  <Router>
    <MuiThemeProvider theme={theme}>
      <SettingsModal />
      <div className="BahnhofsAbfahrten">
        <Route path="/" component={Header} />
        <Route path="/" exact component={FavList} />
        {/* <Switch>
          <Route path="/Privacy" exact component={Privacy} /> */}
        <Route path="/:station" component={AbfahrtenList} />
        {/* </Switch> */}
      </div>
    </MuiThemeProvider>
  </Router>
);

export default hot(module)(BahnhofsAbfahrten);
