/* eslint import/prefer-default-export: 0 */
import { Abfahrt } from 'types/abfahrten';
import { AbfahrtenThunkResult } from 'AppState';
import { createAction } from 'deox';
import { Reihung, Wagenreihung } from 'types/reihung';
import { subMinutes } from 'date-fns';
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
): AbfahrtenThunkResult => async dispatch => {
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
