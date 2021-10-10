import { addBRtoGruppe, calculateComfort } from 'server/Reihung';
import { addDays, addHours, addMinutes, parseISO } from 'date-fns';
import type {
  Fahrzeug,
  Fahrzeuggruppe,
  Formation,
  Position,
  Sektor,
} from 'types/reihung';
import type {
  OEBBCoachSequenceWagon,
  OEBBInfo,
  OEBBPlatformInfo,
  OEBBTimeFormat,
} from 'oebb/types/coachSequence';

function parseOEBBTime(dateString: string, time: OEBBTimeFormat) {
  let date = parseISO(dateString);
  date = addDays(date, time.days);
  date = addHours(date, time.hours);
  date = addMinutes(date, time.days);
  return date;
}

function getSectors(platformInfo?: OEBBPlatformInfo): Sektor[] {
  if (!platformInfo) return [];
  const sectors: Sektor[] = [];
  let startmeter = 0;
  const maxMeter = platformInfo.length;

  platformInfo.sectors.forEach((s) => {
    sectors.push({
      sektorbezeichnung: s.name,
      positionamgleis: {
        startmeter: startmeter.toString(),
        startprozent: ((startmeter / maxMeter) * 100).toString(),
        endemeter: (startmeter + s.length).toString(),
        endeprozent: (((startmeter + s.length) / maxMeter) * 100).toString(),
      },
    });
    startmeter += s.length;
  });

  return sectors;
}

function getFahrzeuggruppen(info: OEBBInfo): Fahrzeuggruppe[] {
  if (!info.train) return [];
  let currentWagons: OEBBCoachSequenceWagon[] = [];
  const wagonsForGroups: OEBBCoachSequenceWagon[][] = [];
  let oldDestination: string | undefined = undefined;
  info.train.wagons.forEach((w) => {
    if (oldDestination && oldDestination !== w.destination) {
      wagonsForGroups.push(currentWagons);
      currentWagons = [];
    }
    currentWagons.push(w);
    oldDestination = w.destination;
  });
  wagonsForGroups.push(currentWagons);

  let startOffset = info.trainOnPlatform?.position || 0;
  const maxMeter =
    info.platform?.length ||
    info.train.wagons.reduce((sum, w) => sum + w.lengthOverBuffers, 0);

  return wagonsForGroups.map((wagons) => {
    const fahrzeuge: Fahrzeug[] = [];
    const positions: Position[] = [];

    for (const w of wagons) {
      const endemeter = startOffset + w.lengthOverBuffers;
      const startprozent = (startOffset / maxMeter) * 100;
      const endeprozent = (endemeter / maxMeter) * 100;
      const position: Position = {
        startmeter: String(startOffset),
        endemeter: String(endemeter),
        startprozent: String(startprozent),
        endeprozent: String(endeprozent),
      };
      positions.push(position);
      startOffset = endemeter;
    }

    wagons.forEach((w, i) => {
      fahrzeuge.push({
        additionalInfo: {
          icons: {
            bike: w.isBicycleAllowed,
            dining: w.isDining,
            info: w.isInfoPoint,
            wheelchair: w.capacityWheelChair > 0,
            quiet: w.isQuietZone,
            family: w.isChildCinema || w.isPlayZone,
            wifi: w.hasWifi,
          },
          klasse: OEBBWagonToKlasse(w),
        },
        allFahrzeugausstattung: [],
        wagenordnungsnummer: w.ranking ? String(w.ranking) : '',
        fahrzeugnummer: w.uicNumber || '',
        fahrzeugtyp: w.kind || '',
        kategorie: '',
        orientierung: '',
        status: w.isLocked ? 'GESCHLOSSEN' : '',
        positioningruppe: String(i),
        fahrzeugsektor: '',
        positionamhalt: positions[i],
      });
    });

    const startPercentage = Math.min(
      ...fahrzeuge.map((f) => Number.parseFloat(f.positionamhalt.startprozent)),
    );
    const endPercentage = Math.max(
      ...fahrzeuge.map((f) => Number.parseFloat(f.positionamhalt.endeprozent)),
    );

    let verkehrlichezugnummer = '';
    const destinationDB640 = wagons[0].destination;
    const train = info.train;
    if (train && train.stations) {
      if (train.wagons.length === wagons.length) {
        verkehrlichezugnummer = info.timeTableInfo.trainNr.toString();
      } else {
        const stationsForTrain = train.stations;
        if (
          stationsForTrain[stationsForTrain.length - 1] === destinationDB640
        ) {
          verkehrlichezugnummer = train.trainNr.toString();
        } else if (info.timeTableInfo.portions.length <= 2) {
          verkehrlichezugnummer =
            info.timeTableInfo.portions
              .find((p) => p.trainNr !== train.trainNr)
              ?.trainNr.toString() || '';
        }
      }
    }

    return {
      allFahrzeug: fahrzeuge,
      goesToFrance: false,
      endPercentage,
      startPercentage,
      fahrzeuggruppebezeichnung: '',
      startbetriebsstellename: wagons[0].origin,
      zielbetriebsstellename: wagons[0].destinationName,
      verkehrlichezugnummer,
    };
  });
}

export function OEBBToDB(info: OEBBInfo): Formation | null {
  if (!info.train) return null;
  // Some wagons are missing position information
  if (info.train.wagons.some((w) => !w.lengthOverBuffers)) return null;
  const trainType = info.timeTableInfo.trainName
    .replace(info.timeTableInfo.trainNr.toString(), '')
    .trim();
  const fahrzeuggruppen = getFahrzeuggruppen(info);
  const startPercentage = Math.min(
    ...fahrzeuggruppen.map((f) => f.startPercentage),
  );
  const endPercentage = Math.max(
    ...fahrzeuggruppen.map((f) => f.endPercentage),
  );

  const fahrzeugGruppenRelevantForDifferentDestination = fahrzeuggruppen.filter(
    (g) =>
      g.allFahrzeug.some(
        (f) => f.additionalInfo.klasse !== 4 && f.status !== 'GESCHLOSSEN',
      ),
  );

  const formation: Formation = {
    fahrtid: '',
    fahrtrichtung: 'VORWAERTS',
    halt: {
      bahnhofsname: info.timeTableInfo.stationName,
      evanummer: '',
      haltid: '',
      rl100: '',
      abfahrtszeit: parseOEBBTime(
        info.timeTableInfo.date,
        info.timeTableInfo.time.reported || info.timeTableInfo.time.scheduled,
      ).toISOString(),
      allSektor: getSectors(info.platform),
      gleisbezeichnung: info.platform?.platform.toString(),
    },
    isRealtime: info.train?.isReported ?? false,
    isActuallyIC: false,
    istplaninformation: false,
    liniebezeichnung: '',
    planstarttag: info.timeTableInfo.date,
    reportedZuggattung: trainType,
    zuggattung: trainType,
    serviceid: '',
    zugnummer: info.timeTableInfo.trainNr.toString(),
    realFahrtrichtung: info.trainOnPlatform
      ? !info.trainOnPlatform.departureTowardsFirstSector
      : undefined,
    scale: 100 / (endPercentage - startPercentage),
    startPercentage,
    endPercentage,
    allFahrzeuggruppe: fahrzeuggruppen,
    differentDestination:
      fahrzeugGruppenRelevantForDifferentDestination.length > 1,
    differentZugnummer: info.timeTableInfo.portions.length > 1,
  };

  formation.allFahrzeuggruppe.forEach((g) => {
    addBRtoGruppe(g, formation);
    g.allFahrzeug.forEach((f) => {
      calculateComfort(f, g);
    });
  });

  return formation;
}

function OEBBWagonToKlasse(
  wagon: OEBBCoachSequenceWagon,
): Fahrzeug['additionalInfo']['klasse'] {
  if (wagon.kind === 'TFZ') return 4;
  // TODO: Is business really first class?
  if (
    (wagon.capacityFirstClass || wagon.capacityBusinessClass) &&
    wagon.capacitySecondClass
  )
    return 3;
  if (wagon.capacitySecondClass || wagon.isDining) return 2;
  // TODO: Is business really first class?
  if (wagon.capacityFirstClass || wagon.capacityBusinessClass) return 1;
  // TODO: mark this as liegeplätze?
  if (wagon.capacityCouchette) return 2;
  // TODO: mark this as schlafplätze?
  if (wagon.capacitySleeper) return 1;
  if (!wagon.ranking) return 4;
  return 0;
}
