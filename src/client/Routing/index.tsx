import { renderRoutes } from 'react-router-config';
import { RoutingFavProvider } from 'Routing/container/RoutingFavContainer';
import Header from './Components/Header';
import PullRefreshWrapper from 'Common/Components/PullRefreshWrapper';
import React from 'react';
import routes from './routes';
import useStyles from './index.style';

const Routing = () => {
  const classes = useStyles();

  return (
    <PullRefreshWrapper>
      <RoutingFavProvider>
        <div className={classes.main}>
          <Header />
          {renderRoutes(routes)}
        </div>
      </RoutingFavProvider>
    </PullRefreshWrapper>
  );
};

export default Routing;
