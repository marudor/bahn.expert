import { RoutingResult } from 'types/routing';
import { uniqBy } from 'lodash';
import { useCallback, useMemo } from 'react';
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
    via,
  } = RoutingConfigContainer.useContainer();

  const commonRouteSettings = useMemo(
    () =>
      start && destination && start.id !== destination.id
        ? {
            start: start?.id,
            destination: destination?.id,
            via: via.map(v => v.id),
            ...settings,
          }
        : undefined,
    [destination, settings, start, via]
  );

  const fetchRoutes = useCallback(async () => {
    if (!commonRouteSettings) return;
    setError(undefined);
    setRoutes(undefined);
    try {
      const routingResult: RoutingResult = (
        await Axios.post(
          '/api/hafas/v1/route',
          {
            time: (date || new Date()).getTime(),
            ...commonRouteSettings,
          },
          {
            params: {
              profile: settings.hafasProfile,
            },
          }
        )
      ).data;

      setRoutes(routingResult.routes);
      setEarlierContext(routingResult.context.earlier);
      setLaterContext(routingResult.context.later);
    } catch (e) {
      setError(e);
    }
  }, [
    commonRouteSettings,
    date,
    setEarlierContext,
    setError,
    setLaterContext,
    setRoutes,
    settings.hafasProfile,
  ]);

  const fetchContext = useCallback(
    async (type: 'earlier' | 'later') => {
      if (!commonRouteSettings) return;

      try {
        const routingResult: RoutingResult = (
          await Axios.post(
            '/api/hafas/v1/route',
            {
              ctxScr: type === 'earlier' ? earlierContext : laterContext,
              ...commonRouteSettings,
            },
            {
              params: {
                profile: settings.hafasProfile,
              },
            }
          )
        ).data;

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
      } catch {
        // we ignore this request and let the user retry for now
      }
    },
    [
      commonRouteSettings,
      earlierContext,
      laterContext,
      setEarlierContext,
      setLaterContext,
      setRoutes,
      settings.hafasProfile,
    ]
  );

  return {
    fetchRoutes,
    fetchContext,
  };
};
