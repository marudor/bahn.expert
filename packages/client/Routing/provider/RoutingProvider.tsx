import { useState } from 'react';
import constate from 'constate';
import type { SingleRoute } from 'types/routing';

const useRoutingInternal = () => {
  const [routes, setRoutes] = useState<SingleRoute[] | undefined>([]);
  const [earlierContext, setEarlierContext] = useState<string>();
  const [laterContext, setLaterContext] = useState<string>();
  const [error, setError] = useState<any>();

  return {
    routes,
    error,
    setRoutes,
    setEarlierContext,
    setLaterContext,
    earlierContext,
    laterContext,
    setError,
  };
};

export const [RoutingProvider, useRouting] = constate(useRoutingInternal);
