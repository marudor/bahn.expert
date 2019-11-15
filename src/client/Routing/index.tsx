import { renderRoutes } from 'react-router-config';
import { RoutingProvider } from 'Routing/container/RoutingContainer';
import Header from './Components/Header';
import React from 'react';
import routes from './routes';
import useStyles from './index.style';

const Routing = () => {
  const classes = useStyles();

  return (
    <RoutingProvider>
      <div className={classes.main}>
        <Header />
        {renderRoutes(routes)}
      </div>
    </RoutingProvider>
  );
};

export default Routing;
