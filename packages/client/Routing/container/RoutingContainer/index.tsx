import { createContainer } from 'unstated-next';
import { ReactNode, useState } from 'react';
import RoutingConfingContainer, {
  defaultRoutingSettings,
} from 'client/Routing/container/RoutingConfigContainer';
import useWebStorage from 'client/useWebStorage';
import type { AllowedHafasProfile } from 'types/HAFAS';
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
export const RoutingProvider = ({ children }: Props) => {
  const storage = useWebStorage();

  const savedRoutingSettings = {
    ...defaultRoutingSettings,
    ...storage.get('rconfig'),
  };

  return (
    <RoutingConfingContainer.Provider initialState={savedRoutingSettings}>
      <RoutingContainer.Provider>{children}</RoutingContainer.Provider>
    </RoutingConfingContainer.Provider>
  );
};
