import type {
  Fahrzeug,
  Fahrzeuggruppe,
  Formation,
  Position,
  Sektor,
} from 'types/reihung';
import type {
  OEBBCoachSequence,
  OEBBCoachSequenceSector,
  OEBBCoachSequenceWagon,
} from 'oebb/types/coachSequence';

export function OEBBToDB(coachSequence: OEBBCoachSequence): Formation | null {
  if (!coachSequence.platform) return null;
  const sektoren: Sektor[] = [];
  let startOffsetMeter = 0;
  const maxMeter = coachSequence.platform.sectors.reduce(
    (agg, s) => agg + s.length,
    0,
  );
  for (const s of coachSequence.platform.sectors) {
    const sector = sectorMap(s, startOffsetMeter, maxMeter);
    startOffsetMeter = Number.parseFloat(sector.positionamgleis.endemeter);

    sektoren.push(sector);
  }
  const [trainType, trainNumber] = coachSequence.trainName.split(' ');
  const fahrzeuggruppe = coachSequenceToFahrzeuggruppe(
    coachSequence,
    trainNumber,
    maxMeter,
  );
  return {
    fahrtid: 'oebb',
    fahrtrichtung: 'VORWAERTS',
    halt: {
      bahnhofsname: coachSequence.trainStation.name,
      evanummer: coachSequence.trainStation.evaCode ?? '',
      haltid: 'oebb',
      rl100: 'oebb',
      ankunftszeit:
        coachSequence.actualArrival ||
        coachSequence.scheduledArrival ||
        undefined,
      abfahrtszeit:
        coachSequence.actualDeparture ||
        coachSequence.scheduledDeparture ||
        undefined,
      allSektor: sektoren,
    },
    isRealtime: true,
    isActuallyIC: false,
    istplaninformation: false,
    liniebezeichnung: '',
    planstarttag: '',
    reportedZuggattung: trainType,
    zuggattung: trainType,
    serviceid: '',
    zugnummer: trainNumber,
    realFahrtrichtung:
      !coachSequence.platform.haltepunkt.departureDirectionSectorA,
    scale:
      100 / (fahrzeuggruppe.endPercentage - fahrzeuggruppe.startPercentage),
    startPercentage: fahrzeuggruppe.startPercentage,
    endPercentage: fahrzeuggruppe.endPercentage,
    allFahrzeuggruppe: [fahrzeuggruppe],
  };
}

function sectorMap(
  sector: OEBBCoachSequenceSector,
  startOffset: number,
  maxMeter: number,
): Sektor {
  const startprozent = (startOffset / maxMeter) * 100;
  const endeprozent = ((startOffset + sector.length) / maxMeter) * 100;
  return {
    sektorbezeichnung: sector.sectorName,
    positionamgleis: {
      startmeter: String(startOffset),
      startprozent: String(startprozent),
      endemeter: String(startOffset + sector.length),
      endeprozent: String(endeprozent),
    },
  };
}

function coachSequenceToFahrzeuggruppe(
  coachSequence: OEBBCoachSequence,
  trainNumber: string,
  maxMeter: number,
): Fahrzeuggruppe {
  const wagons = coachSequence.wagons;
  const positions: Position[] = [];
  let startOffset = coachSequence.platform!.haltepunkt.haltepunktInMeters;
  for (const w of wagons) {
    const endemeter = startOffset + w.laengeUeberPuffer / 100;
    const startprozent = (startOffset / maxMeter) * 100;
    const endeprozent = (endemeter / maxMeter) * 100;
    const position: Position = {
      startmeter: String(startOffset),
      endemeter: String(endemeter),
      startprozent: String(startprozent),
      endeprozent: String(endeprozent),
    };
    startOffset = endemeter;
    positions.push(position);
  }
  const startProzente = positions.map((p) => Number.parseFloat(p.startprozent));
  const minPercentage = Math.min(...startProzente);
  const endeProzente = positions.map((p) => Number.parseFloat(p.endeprozent));
  const maxPercentage = Math.max(...endeProzente);
  return {
    goesToFrance: false,
    zielbetriebsstellename: coachSequence.wagons[0].destination.name,
    verkehrlichezugnummer: trainNumber,
    fahrzeuggruppebezeichnung: 'oebb',
    startbetriebsstellename: coachSequence.wagons[0].origin.name,
    startPercentage: minPercentage,
    endPercentage: maxPercentage,
    allFahrzeug: wagons.map(
      (w, i): Fahrzeug => ({
        additionalInfo: {
          icons: {
            bike: w.fahrradmitnahme,
            dining: w.speisewagen,
            info: w.infoPoint,
            wheelchair: w.rollstuhlgerecht,
            quiet: w.ruhebereich,
            family: w.kinderkino,
            // TODO: WIFI
          },
          klasse: OEBBWagonToKlasse(w),
        },
        allFahrzeugausstattung: [],
        wagenordnungsnummer: String(w.ordnungsNummer),
        fahrzeugnummer: w.uicNummer || '',
        fahrzeugtyp: '',
        kategorie: 'OEBB',
        orientierung: '',
        status: '',
        positioningruppe: String(i),
        fahrzeugsektor: '',
        positionamhalt: positions[i],
      }),
    ),
  };
}

function OEBBWagonToKlasse(
  wagon: OEBBCoachSequenceWagon,
): Fahrzeug['additionalInfo']['klasse'] {
  if (wagon.triebfahrzeug) return 4;
  if (wagon.firstClass && wagon.secondClass) return 3;
  if (wagon.secondClass) return 2;
  if (wagon.firstClass) return 1;
  return 0;
}
