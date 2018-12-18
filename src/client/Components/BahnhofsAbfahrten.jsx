// @flow
import './BahnhofsAbfahrten.scss';
import { Route } from 'react-router-dom';
import AbfahrtenList from './AbfahrtenList';
import FavList from './FavList';
import Header from './Header';
import React from 'react';
import SettingsModal from './LazySettingsModal';
// import Privacy from './Privacy';

class BahnhofsAbfahrten extends React.PureComponent<{||}> {
  componentDidMount() {
    const jssStyles = document.getElementById('jss-server-side');

    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }
  render() {
    return (
      <>
        <SettingsModal />
        <div className="BahnhofsAbfahrten">
          <Route path="/" component={Header} />
          <Route path="/" exact component={FavList} />
          {/* <Switch>
          <Route path="/Privacy" exact component={Privacy} /> */}
          <Route path="/:station" component={AbfahrtenList} />
          {/* </Switch> */}
        </div>
      </>
    );
  }
}

// $FlowFixMe
if (module.hot && typeof module.hot.accept === 'function') {
  module.hot.accept();
}

export default BahnhofsAbfahrten;
