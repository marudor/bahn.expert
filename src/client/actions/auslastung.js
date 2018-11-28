// @flow
/* eslint import/prefer-default-export: 0 */
import { createAction } from 'redux-actions';
import { format } from 'date-fns';
import axios from 'axios';
import type { Auslastung } from 'types/auslastung';
import type { ThunkAction } from 'AppState';

export const Actions = {
  gotAuslastung: createAction<
    string,
    {
      id: string,
      data: Auslastung,
    }
  >('GOT_AUSLASTUNG'),
};

export const getAuslastung: ThunkAction<string> = id => async dispatch => {
  const data = (await axios.get(`/api/auslastung/${id}/${format(new Date(), 'yyyyMMdd')}`)).data;

  dispatch(
    Actions.gotAuslastung({
      id,
      data,
    })
  );
};
