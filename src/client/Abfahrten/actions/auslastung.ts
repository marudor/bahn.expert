/* eslint import/prefer-default-export: 0 */
import { CommonThunkResult } from 'AppState';
import { createAction } from 'deox';
import { Route$Auslastung } from 'types/routing';
import axios from 'axios';

const Actions = {
  gotAuslastung: createAction(
    'GOT_AUSLASTUNG',
    resolve => (p: { id: string; data?: null | Route$Auslastung }) => resolve(p)
  ),
};

export default Actions;

export const getAuslastung = (
  trainNumber: string,
  start: string,
  destination: string,
  time: number
): CommonThunkResult => async dispatch => {
  const key = `${start}/${destination}/${trainNumber}`;

  try {
    const data = (await axios.get(`/api/auslastungHafas/${key}/${time}`)).data;

    dispatch(
      Actions.gotAuslastung({
        id: key,
        data,
      })
    );
  } catch (e) {
    dispatch(
      Actions.gotAuslastung({
        id: key,
        data: null,
      })
    );
  }
};
