import { CommonThunkResult } from 'AppState';
import { createAction } from 'deox';
import { Reihung, Wagenreihung } from 'types/reihung';
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

    const reihung: Wagenreihung = (await axios.get(
      `/api/wagen/${trainNumber}/${scheduledDeparture}`
    )).data;

    dispatch(
      Actions.gotReihung({
        id: trainNumber + currentStation,
        data: reihung.data.istformation,
      })
    );
  } catch (e) {
    dispatch(
      Actions.gotReihung({ id: trainNumber + currentStation, data: null })
    );
  }
};
