import { Route, Switch } from 'react-router-dom';
import Abfahrten from './Abfahrten';
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
      <Route component={Routing} path="/routing" />
      <Route component={Abfahrten} path="/" />
    </Switch>
  );
};

export default App;
