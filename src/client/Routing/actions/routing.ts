import { createAction } from 'deox';
import { Route, RoutingResult } from 'types/routing';
import { RoutingThunkResult } from 'AppState';
import { uniqBy } from 'lodash';
import axios from 'axios';

const Actions = {
  gotRoutes: createAction('GOT_ROUTES', resolve => (r?: Array<Route>) =>
    resolve(r)
  ),
  routesErrored: createAction('ROUTES_ERRORED', resolve => (r?: Object) =>
    resolve(r)
  ),
  gotEarlierContext: createAction(
    'GOT_EARLIER_CONTEXT',
    resolve => (context?: string) => resolve(context)
  ),
  gotLaterContext: createAction(
    'GOT_LATER_CONTEXT',
    resolve => (context?: string) => resolve(context)
  ),
};

export const getRoutes = (
  start: string,
  destination: string,
  date: Date
): RoutingThunkResult => async dispatch => {
  dispatch(Actions.gotRoutes());
  try {
    const routingResult: RoutingResult = (await axios.post('/api/route', {
      start,
      destination,
      time: date.getTime(),
    })).data;

    const { routes, context } = routingResult;

    dispatch(Actions.gotRoutes(routes));
    dispatch(Actions.gotEarlierContext(context.earlier));
    dispatch(Actions.gotLaterContext(context.later));
  } catch (e) {
    dispatch(Actions.routesErrored(e));
  }
};

export enum ContextType {
  earlier = 1,
  later,
}
export const getContextRoutes = (
  type: ContextType
): RoutingThunkResult => async (dispatch, getState) => {
  const { routing, search } = getState();
  const { start, destination } = search;
  const { context, routes: oldRoutes } = routing;

  if (start && destination) {
    try {
      const routingResult: RoutingResult = (await axios.post('/api/route', {
        start: start.id,
        destination: destination.id,
        ctxScr: type === ContextType.earlier ? context.earlier : context.later,
      })).data;

      const { routes, context: newContext } = routingResult;
      let newRoutes;

      if (type === ContextType.earlier) {
        newRoutes = [...routes, ...(oldRoutes || [])];
      } else {
        newRoutes = [...(oldRoutes || []), ...routes];
      }

      newRoutes = uniqBy(newRoutes, 'checksum');

      dispatch(Actions.gotRoutes(newRoutes));
      if (type === ContextType.earlier) {
        dispatch(Actions.gotEarlierContext(newContext.earlier));
      } else {
        dispatch(Actions.gotLaterContext(newContext.later));
      }
    } catch (e) {
      // Ignore for now
    }
  }
};

export default Actions;
