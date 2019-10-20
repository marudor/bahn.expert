import { RoutingResult } from 'types/routing';
import { uniqBy } from 'lodash';
import { useCallback } from 'react';
import Axios from 'axios';
import RoutingConfigContainer from 'Routing/container/RoutingConfigContainer';
import RoutingContainer from 'Routing/container/RoutingContainer';

export default () => {
  const {
    setRoutes,
    setEarlierContext,
    setLaterContext,
    earlierContext,
    laterContext,
    setError,
  } = RoutingContainer.useContainer();
  const {
    settings,
    start,
    destination,
    date,
  } = RoutingConfigContainer.useContainer();

  const fetchRoutes = useCallback(async () => {
    if (!start || !destination || start.id === destination.id) return;
    setError(undefined);
    setRoutes(undefined);
    try {
      const routingResult: RoutingResult = (await Axios.post(
        '/api/hafas/current/route',
        {
          start: start.id,
          destination: destination.id,
          time: (date || new Date()).getTime(),
          ...settings,
        },
        {
          params: {
            profile: settings.hafasProfile,
          },
        }
      )).data;

      setRoutes(routingResult.routes);
      setEarlierContext(routingResult.context.earlier);
      setLaterContext(routingResult.context.later);
    } catch (e) {
      setError(e);
    }
  }, [
    date,
    destination,
    setEarlierContext,
    setError,
    setLaterContext,
    setRoutes,
    settings,
    start,
  ]);

  const fetchContext = useCallback(
    async (type: 'earlier' | 'later') => {
      if (!start || !destination) return;

      const routingResult: RoutingResult = (await Axios.post(
        '/api/hafas/current/route',
        {
          start: start.id,
          destination: destination.id,
          ctxScr: type === 'earlier' ? earlierContext : laterContext,
        }
      )).data;

      setRoutes((oldRoutes = []) => {
        let newRoutes;

        if (type === 'earlier') {
          newRoutes = [...routingResult.routes, ...oldRoutes];
        } else {
          newRoutes = [...oldRoutes, ...routingResult.routes];
        }

        return uniqBy(newRoutes, 'checksum');
      });

      if (type === 'earlier') {
        setEarlierContext(routingResult.context.earlier);
      } else {
        setLaterContext(routingResult.context.later);
      }
    },
    [
      destination,
      earlierContext,
      laterContext,
      setEarlierContext,
      setLaterContext,
      setRoutes,
      start,
    ]
  );

  return {
    fetchRoutes,
    fetchContext,
  };
};
