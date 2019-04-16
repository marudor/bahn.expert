/* eslint import/prefer-default-export: 0 */
import { AbfahrtenThunkResult } from 'AppState';
import { Auslastung } from 'types/auslastung';
import { createAction } from 'deox';
import { format } from 'date-fns';
import axios from 'axios';

const Actions = {
  gotAuslastung: createAction(
    'GOT_AUSLASTUNG',
    resolve => (p: { id: string; data?: null | Auslastung }) => resolve(p)
  ),
};

export default Actions;

export const getAuslastung = (id: string): AbfahrtenThunkResult => async (
  dispatch,
  getState
) => {
  try {
    const data = (await axios.get(
      `/api/auslastung/${id}/${format(new Date(), 'yyyyMMdd')}`
    )).data;

    dispatch(
      Actions.gotAuslastung({
        id,
        data,
      })
    );
  } catch (e) {
    dispatch(
      Actions.gotAuslastung({
        id,
        data: null,
      })
    );
  }
};
