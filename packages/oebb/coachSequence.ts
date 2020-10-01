import { format } from 'date-fns';
import Axios from 'axios';
import type { OebbReihung } from 'oebb/types/coachSequence';

//https://live.oebb.at/backend/api/train/IC%20518/stationEva/8100070/departure/01.10.2020
export async function getCoachSequence(
  trainName: string,
  evaId: string,
  date: number,
): Promise<OebbReihung | undefined> {
  const reihung = (
    await Axios.get<OebbReihung>(
      `https://live.oebb.at/backend/api/train/${trainName}/stationEva/${evaId}/departure/${format(
        date,
        'dd.MM.yyyy',
      )}`,
    )
  ).data;

  if (!reihung?.trainStation?.name) return undefined;
  return reihung;
}
