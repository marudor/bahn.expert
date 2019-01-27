// @flow
/* eslint import/prefer-default-export: 0 */

import { createAction } from 'redux-actions';
import axios from 'axios';
import type { Abfahrt } from 'types/abfahrten';
import type { Reihung, Wagenreihung } from 'types/reihung';
import type { ThunkAction } from 'AppState';

export const Actions = {
  gotReihung: createAction<string, { id: string, data: ?Reihung }>('GOT_REIHUNG'),
};

export const getReihung: ThunkAction<Abfahrt> = ({ scheduledDeparture, trainId, currentStation }) => async dispatch => {
  try {
    if (!scheduledDeparture) {
      throw new Error();
    }

    const reihung: Wagenreihung = (await axios.get(`/api/wagen/${trainId}/${scheduledDeparture}`)).data;

    dispatch(
      Actions.gotReihung({
        id: trainId + currentStation,
        data: reihung.data.istformation,
      })
    );
  } catch (e) {
    dispatch(Actions.gotReihung({ id: trainId + currentStation, data: null }));
  }
};
