import { Route, Switch } from 'react-router-dom';
import Abfahrten from './Abfahrten';
import DetailsRoute from 'Common/Components/Details/DetailsRoute';
import React, { useEffect } from 'react';
import Routing from './Routing';
import useStyles from './App.style';

const App = () => {
  useStyles();
  useEffect(() => {
    const jssStyles = document.querySelector('#jss');

    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }, []);

  return (
    <Switch>
      <Route
        component={DetailsRoute}
        path="/details/:train/:initialDeparture"
      />
      <Route component={Routing} path="/routing" />
      <Route component={Abfahrten} path="/" />
    </Switch>
  );
};

export default App;
