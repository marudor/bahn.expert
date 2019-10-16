import { renderRoutes } from 'react-router-config';
import { RoutingProvider } from 'Routing/container/RoutingContainer';
import React from 'react';
import routes from './routes';

const Routing = () => <RoutingProvider>{renderRoutes(routes)}</RoutingProvider>;

export default Routing;
