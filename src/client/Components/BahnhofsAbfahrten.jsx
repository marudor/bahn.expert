// @flow
import './BahnhofsAbfahrten.scss';
import React from 'react';
import SettingsModal from './LazySettingsModal';
// import Privacy from './Privacy';
import { hot } from 'react-hot-loader/root';
import { renderRoutes } from 'react-router-config';
import { SnackbarProvider } from 'notistack';
import Footer from './Footer';
import Header from './Header';
import routes from '../routes';

class BahnhofsAbfahrten extends React.Component<{||}> {
  componentDidMount() {
    const jssStyles = document.getElementById('jss-server-side');

    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }
  render() {
    return (
      <SnackbarProvider maxSnack={3}>
        <div className="BahnhofsAbfahrten">
          <Header />
          <SettingsModal />
          {renderRoutes(routes)}
          <Footer />
        </div>
      </SnackbarProvider>
    );
  }
}

export default hot(BahnhofsAbfahrten);
