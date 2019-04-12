// @flow
import { type ActionType, handleActions } from 'redux-actions';
import Actions from 'Abfahrten/actions/abfahrten';
import type { $AxiosError } from 'axios';
import type { Abfahrt, Wings } from 'types/abfahrten';
import type { Station } from 'types/station';

type AbfahrtenError = AbfahrtenError$Redirect | AbfahrtenError$404 | AbfahrtenError$Default;
type AbfahrtenError$Redirect = Error & {
  type: 'redirect',
  redirect: string,
  station?: empty,
};

type AbfahrtenError$404 = Error & {
  type: '404',
  station?: empty,
};
type AbfahrtenError$Default = $AxiosError<*> & {
  type: empty,
  station?: string,
};

export type State = {
  selectedDetail: ?string,
  abfahrten: ?Array<Abfahrt>,
  wings: ?Wings,
  currentStation: ?Station,
  error: ?AbfahrtenError,
  lageplan?: ?string,
};

const defaultState = {
  selectedDetail: localStorage.getItem('selectedDetail'),
  abfahrten: null,
  wings: null,
  currentStation: null,
  error: null,
  lageplan: undefined,
};

export default handleActions<State, *>(
  {
    [String(Actions.gotLageplan)]: (state: State, { payload }: ActionType<typeof Actions.gotLageplan>) => ({
      ...state,
      lageplan: payload,
    }),
    [String(Actions.gotAbfahrten)]: (state: State, { payload }: ActionType<typeof Actions.gotAbfahrten>) => ({
      ...state,
      currentStation: payload.station,
      abfahrten: payload.departures,
      wings: payload.wings,
      lageplan: payload.lageplan,
      error: null,
    }),
    [String(Actions.gotAbfahrtenError)]: (state: State, { payload }: ActionType<typeof Actions.gotAbfahrtenError>) => ({
      ...state,
      abfahrten: [],
      wings: {},
      lageplan: undefined,
      error: payload,
    }),
    [String(Actions.setDetail)]: (state: State, { payload }: ActionType<typeof Actions.setDetail>) => ({
      ...state,
      selectedDetail: payload,
    }),
    [String(Actions.setCurrentStation)]: (state: State, { payload }: ActionType<typeof Actions.setCurrentStation>) => ({
      ...state,
      currentStation: payload,
      abfahrten: null,
      wings: null,
      lageplan: undefined,
    }),
  },
  defaultState
);
