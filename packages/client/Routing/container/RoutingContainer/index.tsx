import { AllowedHafasProfile } from 'types/HAFAS';
import { createContainer } from 'unstated-next';
import { ReactNode, useState } from 'react';
import RoutingConfingContainer, {
  RoutingSettings,
} from 'client/Routing/container/RoutingConfigContainer';
import useWebStorage from 'client/useWebStorage';
import type { SingleRoute } from 'types/routing';

const useRouting = () => {
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

const RoutingContainer = createContainer(useRouting);

export default RoutingContainer;

interface Props {
  children: ReactNode;
}

const migrateOldConfig = (storage: ReturnType<typeof useWebStorage>) => {
  const oldConfig = storage.get<RoutingSettings>('rconfig');
  if (oldConfig) {
    for (const [key, value] of Object.entries(oldConfig)) {
      storage.set(key, value);
    }
    storage.remove('rconfig');
  }
};

export const RoutingProvider = ({ children }: Props) => {
  const storage = useWebStorage();
  migrateOldConfig(storage);

  const savedRoutingSettings: RoutingSettings = {
    maxChanges: storage.get('maxChanges') ?? '-1',
    transferTime: storage.get('transferTime') ?? '0',
    hafasProfile: storage.get('hafasProfile') ?? AllowedHafasProfile.DB,
    onlyRegional: storage.get('onlyRegional') ?? false,
  };

  return (
    <RoutingConfingContainer.Provider initialState={savedRoutingSettings}>
      <RoutingContainer.Provider>{children}</RoutingContainer.Provider>
    </RoutingConfingContainer.Provider>
  );
};
