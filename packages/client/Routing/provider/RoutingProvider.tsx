import { RoutingConfigProvider } from 'client/Routing/provider/RoutingConfigProvider';
import { useState } from 'react';
import { useStorage } from 'client/useStorage';
import constate from 'constate';
import type { FC } from 'react';
import type { RoutingSettings } from 'client/Routing/provider/RoutingConfigProvider';
import type { SingleRoute } from 'types/routing';

const useRoutingInternal = () => {
  const [routes, setRoutes] = useState<SingleRoute[] | undefined>([]);
  const [earlierContext, setEarlierContext] = useState<string>();
  const [laterContext, setLaterContext] = useState<string>();
  const [error, setError] = useState();

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

export const [InnerRoutingProvider, useRouting] = constate(useRoutingInternal);

export const RoutingProvider: FC = ({ children }) => {
  const storage = useStorage();

  const savedRoutingSettings: RoutingSettings = {
    maxChanges: storage.get('maxChanges') ?? '-1',
    transferTime: storage.get('transferTime') ?? '0',
    onlyRegional: storage.get('onlyRegional') ?? false,
  };

  return (
    <RoutingConfigProvider initialSettings={savedRoutingSettings}>
      <InnerRoutingProvider>{children}</InnerRoutingProvider>
    </RoutingConfigProvider>
  );
};
