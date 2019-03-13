// @flow
import React from 'react';
import SettingsModal from './LazySettingsModal';
// import Privacy from './Privacy';
import { renderRoutes } from 'react-router-config';
import { SnackbarProvider } from 'notistack';
import Footer from './Footer';
import Header from './Header';
import routes from '../routes';
import withStyles, { type StyledProps } from 'react-jss';

type Props = StyledProps<{||}, typeof styles>;
class BahnhofsAbfahrten extends React.Component<Props> {
  componentDidMount() {
    const jssStyles = document.getElementById('jss-server-side');

    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }
  render() {
    return (
      <SnackbarProvider maxSnack={3}>
        <div className={this.props.classes.main}>
          <Header />
          <SettingsModal />
          {renderRoutes(routes)}
          <Footer />
        </div>
      </SnackbarProvider>
    );
  }
}

const styles = {
  main: {
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'Roboto, sans-serif',
  },
  '@global': {
    body: {
      margin: 0,
    },
    a: {
      textDecoration: 'none',
      color: 'blue',
    },
  },
};

export default withStyles(styles)(BahnhofsAbfahrten);
