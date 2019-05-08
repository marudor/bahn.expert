import { AppState } from 'AppState';
import { connect } from 'react-redux';
import { createStyles, withStyles, WithStyles } from '@material-ui/styles';
import { Route, Switch } from 'react-router-dom';
import Abfahrten from './Abfahrten';
import React from 'react';
import Routing from './Routing';

type StateProps = {
  routingFeature: boolean;
};
type Props = StateProps & WithStyles<typeof styles>;

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
      <Switch>
        {routingFeature && <Route component={Routing} path="/routing" />}
        <Route component={Abfahrten} path="/" />
      </Switch>
    );
  }
}

const styles = createStyles(theme => ({
  '@global': {
    'html, body': {
      height: '100%',
    },
    body: {
      margin: 0,
      fontFamily: 'Roboto, sans-serif',
      backgroundColor: theme.palette.background.default,
      color: theme.palette.text.primary,
    },
    a: {
      textDecoration: 'none',
      color: theme.palette.text.primary,
    },
  },
}));

export default connect<StateProps, {}, {}, AppState>(state => ({
  routingFeature: state.features.routing,
}))(withStyles(styles)(App));
