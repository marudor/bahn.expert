import { CommonThunkResult } from 'AppState';
import { createAction } from 'deox';
import { Reihung } from 'types/reihung';
import axios from 'axios';

const Actions = {
  gotReihung: createAction(
    'GOT_REIHUNG',
    resolve => (p: { id: string; data: null | Reihung }) => resolve(p)
  ),
};

export default Actions;

export const getReihung = (
  trainNumber: string,
  currentStation: string,
  scheduledDeparture?: number
): CommonThunkResult => async dispatch => {
  try {
    if (!scheduledDeparture) {
      throw new Error();
    }

    const reihung: Reihung = (await axios.get(
      `/api/reihung/current/wagen/${trainNumber}/${scheduledDeparture}`
    )).data;

    dispatch(
      Actions.gotReihung({
        id: trainNumber + currentStation,
        data: reihung,
      })
    );
  } catch (e) {
    dispatch(
      Actions.gotReihung({ id: trainNumber + currentStation, data: null })
    );
  }
};
