import { AllowedHafasProfile } from 'types/HAFAS';
import { PropsWithChildren, useState } from 'react';
import {
  RoutingConfigProvider,
  RoutingSettings,
} from 'client/Routing/provider/RoutingConfigProvider';
import { SingleRoute } from 'types/routing';
import { useWebStorage } from 'client/useWebStorage';
import constate from 'constate';

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

const migrateOldConfig = (storage: ReturnType<typeof useWebStorage>) => {
  const oldConfig = storage.get<RoutingSettings>('rconfig');
  if (oldConfig) {
    for (const [key, value] of Object.entries(oldConfig)) {
      storage.set(key, value);
    }
    storage.remove('rconfig');
  }
};

export const [InnerRoutingProvider, useRouting] = constate(useRoutingInternal);

export const RoutingProvider = ({ children }: PropsWithChildren<{}>) => {
  const storage = useWebStorage();
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
