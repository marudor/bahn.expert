import { AllowedHafasProfile } from '@/types/HAFAS';
import { getRouteLink } from '@/client/Routing/util';
import { uniqBy } from '@/client/util';
import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { useRouting } from '@/client/Routing/provider/RoutingProvider';
import {
  useRoutingConfig,
  useRoutingConfigActions,
  useRoutingSettings,
} from '@/client/Routing/provider/RoutingConfigProvider';
import Axios from 'axios';
import type { MinimalStopPlace } from '@/types/stopPlace';
import type { RoutingResult } from '@/types/routing';

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
  const { start, destination, date, via, touchedDate, departureMode } =
    useRoutingConfig();
  const { updateFormattedDate } = useRoutingConfigActions();
  const settings = useRoutingSettings();
  const navigate = useNavigate();

  const getRouteSettings = useCallback(
    (commonStart = start, commonDestination = destination, commonVia = via) =>
      commonStart &&
      commonDestination &&
      commonStart.evaNumber !== commonDestination.evaNumber
        ? {
            start: commonStart?.evaNumber,
            destination: commonDestination?.evaNumber,
            via: commonVia.filter(Boolean).map((v) => ({
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
    async (
      start?: MinimalStopPlace,
      destination?: MinimalStopPlace,
      via: MinimalStopPlace[] = [],
    ) => {
      const routeSettings = getRouteSettings(start, destination, via);
      if (!routeSettings) {
        return;
      }
      setError(undefined);
      setRoutes(undefined);
      try {
        const routingResult = (
          await Axios.post<RoutingResult>(
            '/api/hafas/v3/tripSearch',
            {
              time: touchedDate ? date : new Date(),
              searchForDeparture: departureMode === 'ab',
              ...routeSettings,
            },
            {
              params: {
                profile:
                  routeSettings.hafasProfile === AllowedHafasProfile.OEBB
                    ? routeSettings.hafasProfile
                    : undefined,
              },
            },
          )
        ).data;

        setRoutes(routingResult.routes);
        setEarlierContext(routingResult.context.earlier);
        setLaterContext(routingResult.context.later);
      } catch (error: any) {
        setError(error);
      }
    },
    [
      date,
      setEarlierContext,
      setError,
      setLaterContext,
      setRoutes,
      touchedDate,
      departureMode,
      getRouteSettings,
    ],
  );

  const fetchRoutesAndNavigate = useCallback(
    (
      start?: MinimalStopPlace,
      destination?: MinimalStopPlace,
      via: MinimalStopPlace[] = [],
    ) => {
      updateFormattedDate();

      if (start && destination && start.evaNumber !== destination.evaNumber) {
        void fetchRoutes(start, destination, via);
        navigate(
          getRouteLink(start, destination, via, touchedDate ? date : null),
        );
      }
    },
    [date, fetchRoutes, navigate, touchedDate, updateFormattedDate],
  );

  const fetchContext = useCallback(
    async (type: 'earlier' | 'later') => {
      const routeSettings = getRouteSettings();
      if (!routeSettings) return;

      try {
        const routingResult = (
          await Axios.post<RoutingResult>('/api/hafas/v3/tripSearch', {
            ctxScr: type === 'earlier' ? earlierContext : laterContext,
            ...routeSettings,
          })
        ).data;

        setRoutes((oldRoutes = []) => {
          const newRoutes =
            type === 'earlier'
              ? [...routingResult.routes, ...oldRoutes]
              : [...oldRoutes, ...routingResult.routes];

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
      getRouteSettings,
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

  return {
    fetchRoutes,
    fetchContext,
    clearRoutes,
    fetchRoutesAndNavigate,
  };
};
