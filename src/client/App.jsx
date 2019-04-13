// @flow
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import Abfahrten from './Abfahrten';
import React from 'react';
import Routing from './Routing';
import withStyles, { type StyledProps } from 'react-jss';
import type { AppState } from 'AppState';

type DispatchProps = {|
  dispatch: Function,
|};
type OwnProps = {||};
type StateProps = {|
  routingFeature: boolean,
|};
type ReduxProps = {|
  ...DispatchProps,
  ...OwnProps,
  ...StateProps,
|};
type Props = StyledProps<ReduxProps, typeof styles>;

class App extends React.Component<Props> {
  componentDidMount() {
    const jssStyles = document.getElementById('jss-server-side');

    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }
  render() {
    const { routingFeature } = this.props;

    return (
      <SnackbarProvider preventDuplicate>
        <Switch>
          {routingFeature && <Route component={Routing} path="/routing" />}
          <Route component={Abfahrten} path="/" />
        </Switch>
      </SnackbarProvider>
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

export default connect<ReduxProps, OwnProps, StateProps, DispatchProps, AppState, _>(state => ({
  routingFeature: state.features.routing,
}))(withStyles(styles)(App));
