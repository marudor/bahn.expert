// @flow
/* eslint import/prefer-default-export: 0 */
import { createAction } from 'redux-actions';
import { format } from 'date-fns';
import axios from 'axios';
import type { Auslastung } from 'types/auslastung';

async function getAuslastungForId(trainId: string): Promise<{ id: string, data: Auslastung }> {
  const auslastung = (await axios.get(`/api/auslastung/${trainId}/${format(new Date(), 'yyyyMMdd')}`)).data;

  return {
    id: trainId,
    data: auslastung,
  };
}

export const getAuslastung = createAction('GET_AUSLASTUNG', getAuslastungForId);
