// @flow
/* eslint import/prefer-default-export: 0 */

import { createAction } from 'redux-actions';
import { DateTime } from 'luxon';
import axios from 'axios';
import type { Abfahrt } from 'types/abfahrten';
import type { Reihung, Wagenreihung } from 'types/reihung';

async function getWagenreihungForAbfahrt({
  scheduledDeparture,
  trainId,
}: Abfahrt): Promise<{ id: string, data: ?Reihung }> {
  try {
    if (!scheduledDeparture) {
      throw new Error();
    }

    const time = DateTime.fromFormat(scheduledDeparture, 'HH:mm').toFormat('yyyyMMddHHmm');
    const reihung: Wagenreihung = (await axios.get(`/api/wagen/${trainId}/${time}`)).data;

    return {
      id: String(trainId),
      data: reihung.data.istformation,
    };
  } catch (e) {
    return {
      id: String(trainId),
      data: null,
    };
  }
}

export const getReihung = createAction('GET_REIHUNG', getWagenreihungForAbfahrt);
