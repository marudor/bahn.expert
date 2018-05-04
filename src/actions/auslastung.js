// @flow
/* eslint import/prefer-default-export: 0 */
import { createAction } from 'redux-actions';
import { DateTime } from 'luxon';
import axios from 'axios';
import type { Auslastung } from 'types/auslastung';

async function getAuslastungForId(trainId: number): Promise<{ id: string, data: Auslastung }> {
  const time = DateTime.local();

  const auslastung = (await axios.get(`/api/auslastung/${trainId}/${time.toFormat('yyyyMMdd')}`)).data;

  return {
    id: String(trainId),
    data: auslastung,
  };
}

export const getAuslastung = createAction('GET_AUSLASTUNG', getAuslastungForId);
