// @flow
import { createSelector } from 'reselect';
import type { OwnProps as AbfahrtProps } from '../Components/Abfahrt';
import type { AppState } from 'AppState';
import type { ResolvedWings, Wings } from 'types/abfahrten';

export const getWings = (state: AppState) => state.abfahrten.wings;
export const getSelectedDetail = (state: AppState) => state.abfahrten.selectedDetail;
export const getArrivalWingIdsFromProps = (_: AppState, props: AbfahrtProps) => props.abfahrt.arrivalWingIds;
export const getDepartureWingIdsFromProps = (_: AppState, props: AbfahrtProps) => props.abfahrt.departureWingIds;
export const getIdFromProps = (_: AppState, props: AbfahrtProps) => props.abfahrt.id;

export const getWingsForAbfahrt = createSelector<
  AppState,
  AbfahrtProps,
  ?ResolvedWings,
  ?Wings,
  ?(string[]),
  ?(string[])
>(
  getWings,
  getArrivalWingIdsFromProps,
  getDepartureWingIdsFromProps,
  (wings, arrivalWingIds, departureWingIds) =>
    wings
      ? {
          // $FlowFixMe - optional chaining call
          arrivalWings: arrivalWingIds?.map(w => wings[w]).filter(Boolean),
          // $FlowFixMe - optional chaining call
          departureWings: departureWingIds?.map(w => wings[w]).filter(Boolean),
        }
      : undefined
);

export const getDetailForAbfahrt = createSelector<AppState, AbfahrtProps, boolean, ?string, string>(
  getSelectedDetail,
  getIdFromProps,
  (selectedDetail, id) => selectedDetail === id
);
