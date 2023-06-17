import { useMemo, useState } from 'react';
import constate from 'constate';
import type { PropsWithChildren } from 'react';
import type { SingleRoute } from '@/types/routing';

const useRoutingInternal = (_p: PropsWithChildren<unknown>) => {
  const [routes, setRoutes] = useState<SingleRoute[] | undefined>([]);
  const [earlierContext, setEarlierContext] = useState<string>();
  const [laterContext, setLaterContext] = useState<string>();
  const [error, setError] = useState<any>();
  const rideableRoutes = useMemo(
    () => routes?.filter((r) => r.isRideable),
    [routes],
  );

  return {
    rideableRoutes,
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
