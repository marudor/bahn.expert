import { getSingleStation } from 'server/Abfahrten/station';
import { Station } from 'types/station';

export default async function(ds100: string): Promise<Station | undefined> {
  const timetablesStation = await getSingleStation(ds100);

  if (timetablesStation.ds100.toLowerCase() === ds100.toLowerCase()) {
    return {
      DS100: timetablesStation.ds100,
      title: timetablesStation.name,
      id: timetablesStation.eva,
    };
  }
}
