import { renderRoutes } from 'react-router-config';
import Header from './Components/Header';
import React from 'react';
import routes from './routes';
import useStyles from './index.style';

const Routing = () => {
  const classes = useStyles();

  return (
    <div className={classes.main}>
      <Header />
      {renderRoutes(routes)}
    </div>
  );
};

export default Routing;
