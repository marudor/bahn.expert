// @flow
import { Route, Switch } from 'react-router-dom';
import Abfahrten from './Abfahrten';
import React from 'react';
import Routing from './Routing';
import withStyles, { type StyledProps } from 'react-jss';

type Props = StyledProps<{||}, typeof styles>;

class App extends React.Component<Props> {
  componentDidMount() {
    const jssStyles = document.getElementById('jss-server-side');

    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }
  render() {
    return (
      <Switch>
        <Route component={Routing} path="/routing" />
        <Route component={Abfahrten} path="/" />
      </Switch>
    );
  }
}

const styles = {
  '@global': {
    body: {
      margin: 0,
      fontFamily: 'Roboto, sans-serif',
    },
    a: {
      textDecoration: 'none',
      color: 'blue',
    },
  },
};

export default withStyles(styles)(App);
