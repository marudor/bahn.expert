import { renderRoutes } from 'react-router-config';
import { RoutingFavProvider } from 'Routing/container/RoutingFavContainer';
import Header from './Components/Header';
import routes from './routes';
import useStyles from './index.style';

const Routing = () => {
  const classes = useStyles();

  return (
    <RoutingFavProvider>
      <div className={classes.main}>
        <Header />
        {renderRoutes(routes)}
      </div>
    </RoutingFavProvider>
  );
};

export default Routing;
