import { AllowedHafasProfile } from 'types/HAFAS';
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
  const [currentProfile, setCurrentProfile] = useState<AllowedHafasProfile>();

  return {
    routes,
    error,
    setRoutes,
    setEarlierContext,
    setLaterContext,
    earlierContext,
    laterContext,
    setError,
    currentProfile,
    setCurrentProfile,
  };
};

const migrateOldConfig = (storage: ReturnType<typeof useStorage>) => {
  const oldConfig = storage.get('rconfig');
  if (oldConfig) {
    for (const [key, value] of Object.entries(oldConfig)) {
      storage.set(key, value);
    }
    storage.remove('rconfig');
  }
};

export const [InnerRoutingProvider, useRouting] = constate(useRoutingInternal);

export const RoutingProvider: FC = ({ children }) => {
  const storage = useStorage();
  migrateOldConfig(storage);

  const savedRoutingSettings: RoutingSettings = {
    maxChanges: storage.get('maxChanges') ?? '-1',
    transferTime: storage.get('transferTime') ?? '0',
    hafasProfile: storage.get('hafasProfile') ?? AllowedHafasProfile.DB,
    onlyRegional: storage.get('onlyRegional') ?? false,
  };

  return (
    <RoutingConfigProvider initialSettings={savedRoutingSettings}>
      <InnerRoutingProvider>{children}</InnerRoutingProvider>
    </RoutingConfigProvider>
  );
};
