// @flow
import './BahnhofsAbfahrten.scss';
import React from 'react';
import SettingsModal from './LazySettingsModal';
// import Privacy from './Privacy';
import { Route } from 'react-router-dom';
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
      <div className="BahnhofsAbfahrten">
        <SettingsModal />
        {routes.map((r, i) => (
          <Route key={i} {...r} />
        ))}
      </div>
    );
  }
}

// $FlowFixMe
if (module.hot && typeof module.hot.accept === 'function') {
  module.hot.accept();
}

export default BahnhofsAbfahrten;
