// @flow
import { createSelector } from 'reselect';
import type { Route as RouteType } from 'types/routing';
import type { RoutingState } from 'AppState';

type RouteProps = {
  +route: RouteType,
};

export const getSelectedDetail = (state: RoutingState) => state.routing.selectedDetail;
export const getCidFromProps = (_: RoutingState, props: RouteProps) => props.route.cid;

export const getDetailForRoute = createSelector<RoutingState, RouteProps, boolean, ?string, string>(
  getSelectedDetail,
  getCidFromProps,
  (selectedDetail, cid) => selectedDetail === cid
);
