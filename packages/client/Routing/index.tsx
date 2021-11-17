import { Header } from './Components/Header';
import { makeStyles } from '@material-ui/core';
import { RoutingConfigProvider } from 'client/Routing/provider/RoutingConfigProvider';
import { RoutingFavProvider } from 'client/Routing/provider/RoutingFavProvider';
import { RoutingRoutes } from 'client/Routing/RoutingRoutes';
import type { FC } from 'react';

const useStyles = makeStyles({
  wrap: {
    display: 'flex',
    flexDirection: 'column',
  },
});

export const Routing: FC = () => {
  const classes = useStyles();
  return (
    <RoutingConfigProvider>
      <RoutingFavProvider>
        <div className={classes.wrap}>
          <Header />
          <RoutingRoutes />
        </div>
      </RoutingFavProvider>
    </RoutingConfigProvider>
  );
};
// eslint-disable-next-line import/no-default-export
export default Routing;
