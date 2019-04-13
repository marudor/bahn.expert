// @flow
/* eslint import/prefer-default-export: 0 */
import { createAction } from 'redux-actions';
import { format } from 'date-fns';
import axios from 'axios';
import type { AbfahrtenThunkAction } from 'AppState';
import type { Auslastung } from 'types/auslastung';

const Actions = {
  gotAuslastung: createAction<
    string,
    {
      id: string,
      data: ?Auslastung,
    }
  >('GOT_AUSLASTUNG'),
};

export default Actions;

export const getAuslastung: AbfahrtenThunkAction<string> = id => async dispatch => {
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
