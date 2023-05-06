import { enrichCoachSequence } from '@/server/coachSequence/commonMapping';
import { getLineFromNumber } from '@/server/journeys/lineNumberMapping';
import { logger } from '@/server/logger';
import type {
  BaseFahrzeug,
  BaseFahrzeuggruppe,
  BaseFormation,
  FahrzeugKategorie,
  Halt,
  Position,
  Sektor,
} from '@/types/reihung';
import type {
  CoachSequence,
  CoachSequenceCoach,
  CoachSequenceCoachFeatures,
  CoachSequenceGroup,
  CoachSequenceInformation,
  CoachSequencePosition,
  CoachSequenceProduct,
  CoachSequenceSector,
  CoachSequenceStop,
} from '@/types/coachSequence';
import type { VehicleCategory } from '@/business-hub/generated/coachSequence';

const mapClass = (category: VehicleCategory) => {
  switch (category) {
    // case 'DOPPELSTOCKSTEUERWAGENZWEITEKLASSE':
    // case 'DOPPELSTOCKWAGENZWEITEKLASSE':
    // case 'REISEZUGWAGENZWEITEKLASSE':
    // case 'STEUERWAGENZWEITEKLASSE':
    // case 'HALBSPEISEWAGENZWEITEKLASSE':
    // case 'SPEISEWAGEN':
    case 'SLEEPER_ECONOMY_CLASS':
    case 'COUCHETTE_ECONOMY_CLASS':
    case 'CONTROLCAR_ECONOMY_CLASS':
    case 'DOUBLEDECK_ECONOMY_CLASS':
    case 'HALFDININGCAR_ECONOMY_CLASS':
    case 'DOUBLECONTROLCAR_ECONOMY_CLASS':
    case 'PASSENGERCARRIAGE_ECONOMY_CLASS':
    case 'DOUBLEDECK_CONTROLCAR_ECONOMY_CLASS':
    case 'DININGCAR':
      return 2;
    // case 'DOPPELSTOCKWAGENERSTEZWEITEKLASSE':
    // case 'DOPPELSTOCKSTEUERWAGENERSTEZWEITEKLASSE':
    // case 'STEUERWAGENERSTEZWEITEKLASSE':
    // case 'REISEZUGWAGENERSTEZWEITEKLASSE':
    case 'SLEEPER_FIRST_ECONOMY_CLASS':
    case 'CONTROLCAR_FIRST_ECONOMY_CLASS':
    case 'DOUBLEDECK_FIRST_ECONOMY_CLASS':
    case 'DOUBLECONTROLCAR_FIRST_ECONOMY_CLASS':
    case 'PASSENGERCARRIAGE_FIRST_ECONOMY_CLASS':
    case 'DOUBLEDECK_CONTROLCAR_FIRST_ECONOMOY_CLASS':
      return 3;
    // case 'HALBSPEISEWAGENERSTEKLASSE':
    // case 'DOPPELSTOCKWAGENERSTEKLASSE':
    // case 'REISEZUGWAGENERSTEKLASSE':
    // case 'STEUERWAGENERSTEKLASSE':
    case 'SLEEPER_FIRST_CLASS':
    case 'COUCHETTE_FIRST_CLASS':
    case 'CONTROLCAR_FIRST_CLASS':
    case 'DOUBLEDECK_FIRST_CLASS':
    case 'HALFDININGCAR_FIRST_CLASS':
    case 'PASSENGERCARRIAGE_FIRST_CLASS':
    case 'DOUBLEDECK_CONTROLCAR_FIRST_CLASS':
      return 1;
    case 'BAGGAGECAR':
    case 'POWERCAR':
    case 'LOCOMOTIVE':
      return 4;
    default:
      return 0;
  }
};

const mapPosition = (position: Position): CoachSequencePosition | undefined => {
  const endPercent = Number.parseFloat(position.endeprozent);
  const startPercent = Number.parseFloat(position.startprozent);
  if (Number.isNaN(startPercent) || Number.isNaN(endPercent)) return;
  return {
    endPercent,
    startPercent,
  };
};

const mapFeatures = (fahrzeug: BaseFahrzeug): CoachSequenceCoachFeatures => {
  const features: CoachSequenceCoachFeatures = {};
  if (fahrzeug.kategorie.includes('SPEISEWAGEN')) {
    features.dining = true;
  }
  for (const ausstattung of fahrzeug.allFahrzeugausstattung) {
    switch (ausstattung.ausstattungsart) {
      case 'PLAETZEROLLSTUHL':
        features.wheelchair = true;
        break;
      case 'PLAETZEFAHRRAD':
        features.bike = true;
        break;
      case 'BISTRO':
        features.dining = true;
        break;
      case 'RUHE':
        features.quiet = true;
        break;
      case 'FAMILIE':
        features.family = true;
        break;
      case 'PLAETZEBAHNCOMFORT':
        features.comfort = true;
        break;
      case 'PLAETZESCHWERBEH':
        features.disabled = true;
        break;
      case 'INFO':
        features.info = true;
        break;
      case 'ABTEILKLEINKIND':
        features.toddler = true;
        break;
    }
  }

  return features;
};

function mapFahrzeugkategorie(kategorie: FahrzeugKategorie): VehicleCategory {
  switch (kategorie) {
    case 'DOPPELSTOCKSTEUERWAGENERSTEZWEITEKLASSE':
      return 'DOUBLEDECK_CONTROLCAR_FIRST_ECONOMOY_CLASS';
    case 'DOPPELSTOCKSTEUERWAGENZWEITEKLASSE':
      return 'DOUBLEDECK_CONTROLCAR_ECONOMY_CLASS';
    case 'DOPPELSTOCKWAGENERSTEKLASSE':
      return 'DOUBLEDECK_FIRST_CLASS';
    case 'DOPPELSTOCKWAGENERSTEZWEITEKLASSE':
      return 'DOUBLEDECK_FIRST_ECONOMY_CLASS';
    case 'DOPPELSTOCKWAGENZWEITEKLASSE':
      return 'DOUBLEDECK_ECONOMY_CLASS';
    case 'HALBSPEISEWAGENERSTEKLASSE':
      return 'HALFDININGCAR_FIRST_CLASS';
    case 'HALBSPEISEWAGENZWEITEKLASSE':
      return 'HALFDININGCAR_ECONOMY_CLASS';
    case 'LOK':
      return 'LOCOMOTIVE';
    case 'REISEZUGWAGENERSTEKLASSE':
      return 'PASSENGERCARRIAGE_FIRST_CLASS';
    case 'REISEZUGWAGENERSTEZWEITEKLASSE':
      return 'PASSENGERCARRIAGE_FIRST_ECONOMY_CLASS';
    case 'REISEZUGWAGENZWEITEKLASSE':
      return 'PASSENGERCARRIAGE_ECONOMY_CLASS';
    case 'SPEISEWAGEN':
      return 'DININGCAR';
    case 'STEUERWAGENERSTEKLASSE':
      return 'CONTROLCAR_FIRST_CLASS';
    case 'STEUERWAGENERSTEZWEITEKLASSE':
      return 'CONTROLCAR_FIRST_ECONOMY_CLASS';
    case 'STEUERWAGENZWEITEKLASSE':
      return 'CONTROLCAR_ECONOMY_CLASS';
    case 'TRIEBKOPF':
      return 'POWERCAR';
    case 'DOPPELSTOCKSTEUERWAGENERSTEKLASSE':
      return 'DOUBLEDECK_CONTROLCAR_FIRST_CLASS';
    default:
      return 'UNDEFINED';
  }
}

const mapCoach = (fahrzeug: BaseFahrzeug): CoachSequenceCoach | undefined => {
  const position = mapPosition(fahrzeug.positionamhalt);
  if (!position) return;
  const vehicleCategory = mapFahrzeugkategorie(fahrzeug.kategorie);
  const travellerClass = mapClass(vehicleCategory);
  return {
    class: travellerClass,
    // category: fahrzeug.kategorie,
    vehicleCategory,
    closed:
      fahrzeug.status === 'GESCHLOSSEN' || travellerClass === 4
        ? true
        : undefined,
    position,
    identificationNumber: fahrzeug.wagenordnungsnummer,
    type: fahrzeug.fahrzeugtyp,
    uic: fahrzeug.fahrzeugnummer,
    features: mapFeatures(fahrzeug),
  };
};

const mapGroup = (
  gruppe: BaseFahrzeuggruppe,
): CoachSequenceGroup | undefined => {
  const coaches = gruppe.allFahrzeug.map(mapCoach);
  if (coaches.includes(undefined)) return;
  return {
    coaches: coaches as CoachSequenceCoach[],
    destinationName: gruppe.zielbetriebsstellename,
    originName: gruppe.startbetriebsstellename,
    name: gruppe.fahrzeuggruppebezeichnung,
    number: gruppe.verkehrlichezugnummer,
  };
};

const mapSequence = (formation: BaseFormation): CoachSequence | undefined => {
  const grouped: Record<string, BaseFahrzeuggruppe[]> = {};
  for (const g of formation.allFahrzeuggruppe) {
    const key =
      g.verkehrlichezugnummer +
      g.zielbetriebsstellename +
      g.startbetriebsstellename +
      (g.fahrzeuggruppebezeichnung.includes('IC')
        ? g.fahrzeuggruppebezeichnung
        : '');
    grouped[key] = grouped[key] || [];
    grouped[key].push(g);
  }

  const regrouped: BaseFahrzeuggruppe[] = Object.values(grouped).map(
    (groups) => {
      return {
        ...groups[0],
        fahrzeuggruppebezeichnung:
          groups.length > 1
            ? // eslint-disable-next-line unicorn/no-array-reduce
              groups.reduce(
                (n, g) => `${n}-${g.fahrzeuggruppebezeichnung}`,
                'regrouped',
              )
            : groups[0].fahrzeuggruppebezeichnung,
        allFahrzeug: groups.flatMap((g) => g.allFahrzeug),
      };
    },
  );

  const groups = regrouped.map(mapGroup);
  if (groups.includes(undefined)) return;
  return {
    groups: groups as CoachSequenceGroup[],
  };
};

const mapSector = (sektor: Sektor): CoachSequenceSector | undefined => {
  const position = mapPosition(sektor.positionamgleis);
  if (!position) return;

  return {
    name: sektor.sektorbezeichnung,
    position,
  };
};

const mapStop = (halt: Halt): CoachSequenceStop => {
  let sectors = halt.allSektor.map(mapSector);
  if (sectors.includes(undefined)) {
    sectors = [];
  }

  return {
    stopPlace: {
      evaNumber: halt.evanummer,
      name: halt.bahnhofsname,
    },
    // @ts-expect-error we checked for undefined
    sectors,
  };
};

const mapProduct = (formation: BaseFormation): CoachSequenceProduct => ({
  number: formation.zugnummer,
  type: formation.zuggattung,
  line: getLineFromNumber(formation.zugnummer),
});

function mapDirection(coaches: CoachSequenceCoach[]) {
  const first = coaches[0];
  const last = coaches[coaches.length - 1];

  return last.position.startPercent > first.position.startPercent;
}

export const mapInformation = (
  formation: BaseFormation,
): CoachSequenceInformation | undefined => {
  if (
    formation.auslastungsstufe &&
    (formation.auslastungsstufe.auslastungsstufeErsteKlasse !== 'UNDEFINIERT' ||
      formation.auslastungsstufe.auslastungsstufeZweiteKlasse !== 'UNDEFINIERT')
  ) {
    logger.info(`Auslastung Wagenreihung gefunden: ${formation.zugnummer}`);
  }

  const sequence = mapSequence(formation);
  if (!sequence) return;
  const allCoaches = sequence.groups.flatMap((g) => g.coaches);

  const information: CoachSequenceInformation = {
    source: 'DB-newApps',
    sequence,
    product: mapProduct(formation),
    stop: mapStop(formation.halt),
    direction: mapDirection(allCoaches),
    isRealtime: allCoaches.every(
      (c) => c.uic || c.vehicleCategory === 'LOCOMOTIVE',
    ),
  };
  enrichCoachSequence(information);
  return information;
};
