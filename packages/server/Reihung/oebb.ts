import type { BaseFormation, Sektor } from 'types/reihung';
import type { OebbReihung, OebbSector } from 'oebb';

function mapSector(sector: OebbSector): Sektor {
  return {
    sektorbezeichnung: sector.sectorName,
    positionamgleis: {},
  };
}

export function mapOebbToDB(coachSequence: OebbReihung): BaseFormation {
  return {
    fahrtrichtung: 'VORWAERTS',
    halt: {
      bahnhofsname: coachSequence.trainStation.name,
      evanummer: coachSequence.trainStation.evaCode,
      allSektor: coachSequence.platform.sectors.map(mapSector),
    },
  };
}
