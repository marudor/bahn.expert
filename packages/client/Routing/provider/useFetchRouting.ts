import { uniqBy } from 'client/util';
import { useCallback, useEffect, useMemo } from 'react';
import { useHistory } from 'react-router';
import { useRouting } from 'client/Routing/provider/RoutingProvider';
import {
  useRoutingConfig,
  useRoutingSettings,
} from 'client/Routing/provider/RoutingConfigProvider';
import Axios from 'axios';
import type { RoutingFav } from 'client/Routing/provider/RoutingFavProvider';
import type { RoutingResult } from 'types/routing';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useFetchRouting = () => {
  const {
    setRoutes,
    setEarlierContext,
    setLaterContext,
    earlierContext,
    laterContext,
    setError,
  } = useRouting();
  const { start, destination, date, via } = useRoutingConfig();
  const settings = useRoutingSettings();

  const commonRouteSettings = useMemo(
    () =>
      start && destination && start.evaNumber !== destination.evaNumber
        ? {
            start: start?.evaNumber,
            destination: destination?.evaNumber,
            via: via.map((v) => ({
              evaId: v.evaNumber,
            })),
            ...settings,
            maxChanges: settings.maxChanges || '-1',
            transferTime: settings.transferTime || '0',
          }
        : undefined,
    [destination, settings, start, via],
  );

  const fetchRoutes = useCallback(
    async (routeSettings: typeof commonRouteSettings = commonRouteSettings) => {
      if (!routeSettings) return;
      setError(undefined);
      setRoutes(undefined);
      try {
        const routingResult = (
          await Axios.post<RoutingResult>('/api/hafas/v3/tripSearch', {
            time: date || new Date(),
            ...routeSettings,
          })
        ).data;

        setRoutes(routingResult.routes);
        setEarlierContext(routingResult.context.earlier);
        setLaterContext(routingResult.context.later);
      } catch (e: any) {
        setError(e);
      }
    },
    [
      commonRouteSettings,
      date,
      setEarlierContext,
      setError,
      setLaterContext,
      setRoutes,
    ],
  );

  const fetchContext = useCallback(
    async (type: 'earlier' | 'later') => {
      if (!commonRouteSettings) return;

      try {
        const routingResult = (
          await Axios.post<RoutingResult>('/api/hafas/v3/tripSearch', {
            ctxScr: type === 'earlier' ? earlierContext : laterContext,
            ...commonRouteSettings,
          })
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
    ],
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
      void fetchRoutes({
        start: fav.start.evaNumber,
        destination: fav.destination.evaNumber,
        via: fav.via.map((v) => ({
          evaId: v.evaNumber,
        })),
        ...settings,
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
