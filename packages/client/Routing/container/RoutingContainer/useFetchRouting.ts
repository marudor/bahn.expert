import { useCallback, useEffect, useMemo } from 'react';
import { useHistory } from 'react-router';
import request from 'umi-request';
import RoutingConfigContainer from 'client/Routing/container/RoutingConfigContainer';
import RoutingContainer from 'client/Routing/container/RoutingContainer';
import uniqBy from 'shared/util/uniqBy';
import type { RoutingFav } from 'client/Routing/container/RoutingFavContainer';
import type { RoutingResult } from 'types/routing';

export default () => {
  const {
    setRoutes,
    setEarlierContext,
    setLaterContext,
    earlierContext,
    laterContext,
    setCurrentProfile,
    currentProfile,
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
            via: via.map((v) => v.id),
            ...settings,
          }
        : undefined,
    [destination, settings, start, via]
  );

  const fetchRoutes = useCallback(
    async (routeSettings: typeof commonRouteSettings = commonRouteSettings) => {
      if (!routeSettings) return;
      setError(undefined);
      setRoutes(undefined);
      try {
        const routingResult = await request.post<RoutingResult>(
          '/api/hafas/v1/tripSearch',
          {
            data: {
              time: (date || new Date()).getTime(),
              ...routeSettings,
            },
            params: {
              profile: routeSettings.hafasProfile,
            },
          }
        );

        setRoutes(routingResult.routes);
        setEarlierContext(routingResult.context.earlier);
        setLaterContext(routingResult.context.later);
        setCurrentProfile(routeSettings.hafasProfile);
      } catch (e) {
        setError(e);
      }
    },
    [
      commonRouteSettings,
      date,
      setCurrentProfile,
      setEarlierContext,
      setError,
      setLaterContext,
      setRoutes,
    ]
  );

  const fetchContext = useCallback(
    async (type: 'earlier' | 'later') => {
      if (!commonRouteSettings) return;

      try {
        const routingResult = await request.post<RoutingResult>(
          '/api/hafas/v1/tripSearch',
          {
            data: {
              ctxScr: type === 'earlier' ? earlierContext : laterContext,
              ...commonRouteSettings,
            },
            params: {
              profile: currentProfile,
            },
          }
        );

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
      currentProfile,
      earlierContext,
      laterContext,
      setEarlierContext,
      setLaterContext,
      setRoutes,
    ]
  );

  const clearRoutes = useCallback(() => {
    setRoutes([]);
    setEarlierContext(undefined);
    setLaterContext(undefined);
  }, [setEarlierContext, setLaterContext, setRoutes]);

  const history = useHistory<
    | undefined
    | {
        fav: RoutingFav;
      }
  >();

  useEffect(() => {
    const fav = history.location.state?.fav;

    if (fav) {
      history.replace(history.location.pathname);
      fetchRoutes({
        start: fav.start.id,
        destination: fav.destination.id,
        via: fav.via.map((v) => v.id),
        ...settings,
        hafasProfile: fav.profile,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history.location.state]);

  return {
    fetchRoutes,
    fetchContext,
    clearRoutes,
  };
};
