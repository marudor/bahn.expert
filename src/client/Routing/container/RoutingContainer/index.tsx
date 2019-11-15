import { createContainer } from 'unstated-next';
import { SingleRoute } from 'types/routing';
import React, { ReactNode, useState } from 'react';
import RoutingConfingContainer, {
  defaultRoutingSettings,
} from 'Routing/container/RoutingConfigContainer';
import useCookies from 'Common/useCookies';

const useRouting = () => {
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

const RoutingContainer = createContainer(useRouting);

export default RoutingContainer;

interface Props {
  children: ReactNode;
}
export const RoutingProvider = ({ children }: Props) => {
  const cookies = useCookies();

  const savedRoutingSettings = {
    ...defaultRoutingSettings,
    ...cookies.get('rconfig'),
  };

  return (
    <RoutingConfingContainer.Provider initialState={savedRoutingSettings}>
      <RoutingContainer.Provider>{children}</RoutingContainer.Provider>
    </RoutingConfingContainer.Provider>
  );
};
