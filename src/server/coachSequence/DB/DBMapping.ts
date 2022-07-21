import { enrichCoachSequence } from 'server/coachSequence/commonMapping';
import { getLineFromNumber } from 'server/journeys/lineNumberMapping';
import type {
  BaseFahrzeug,
  BaseFahrzeuggruppe,
  BaseFormation,
  FahrzeugKategorie,
  Halt,
  Position,
  Sektor,
} from 'types/reihung';
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
} from 'types/coachSequence';

const mapClass = (kategorie: FahrzeugKategorie) => {
  switch (kategorie) {
    case 'DOPPELSTOCKSTEUERWAGENZWEITEKLASSE':
    case 'DOPPELSTOCKWAGENZWEITEKLASSE':
    case 'REISEZUGWAGENZWEITEKLASSE':
    case 'STEUERWAGENZWEITEKLASSE':
    case 'HALBSPEISEWAGENZWEITEKLASSE':
    case 'SPEISEWAGEN':
      return 2;
    case 'DOPPELSTOCKWAGENERSTEZWEITEKLASSE':
    case 'DOPPELSTOCKSTEUERWAGENERSTEZWEITEKLASSE':
    case 'STEUERWAGENERSTEZWEITEKLASSE':
    case 'REISEZUGWAGENERSTEZWEITEKLASSE':
      return 3;
    case 'HALBSPEISEWAGENERSTEKLASSE':
    case 'DOPPELSTOCKWAGENERSTEKLASSE':
    case 'REISEZUGWAGENERSTEKLASSE':
    case 'STEUERWAGENERSTEKLASSE':
      return 1;
    case 'TRIEBKOPF':
    case 'LOK':
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
  fahrzeug.allFahrzeugausstattung.forEach((ausstattung) => {
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
  });

  return features;
};

const mapCoach = (fahrzeug: BaseFahrzeug): CoachSequenceCoach | undefined => {
  const position = mapPosition(fahrzeug.positionamhalt);
  if (!position) return;
  const travellerClass = mapClass(fahrzeug.kategorie);
  return {
    class: travellerClass,
    category: fahrzeug.kategorie,
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
    // @ts-expect-error we checked for undefined
    coaches,
    destinationName: gruppe.zielbetriebsstellename,
    originName: gruppe.startbetriebsstellename,
    name: gruppe.fahrzeuggruppebezeichnung,
    number: gruppe.verkehrlichezugnummer,
  };
};

const mapSequence = (formation: BaseFormation): CoachSequence | undefined => {
  const grouped = formation.allFahrzeuggruppe.reduce((agg, g) => {
    const key =
      g.verkehrlichezugnummer +
      g.zielbetriebsstellename +
      g.startbetriebsstellename +
      (g.fahrzeuggruppebezeichnung.includes('IC')
        ? g.fahrzeuggruppebezeichnung
        : '');
    agg[key] = agg[key] || [];
    agg[key].push(g);
    return agg;
  }, {} as Record<string, BaseFahrzeuggruppe[]>);

  const regrouped: BaseFahrzeuggruppe[] = Object.values(grouped).map(
    (groups) => {
      return {
        ...groups[0],
        fahrzeuggruppebezeichnung:
          groups.length > 1
            ? groups.reduce(
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
    // @ts-expect-error we checked for undefined
    groups,
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
  const sequence = mapSequence(formation);
  if (!sequence) return;
  const allCoaches = sequence.groups.flatMap((g) => g.coaches);

  const information = {
    sequence,
    product: mapProduct(formation),
    stop: mapStop(formation.halt),
    direction: mapDirection(allCoaches),
    isRealtime: allCoaches.every((c) => c.uic || c.category === 'LOK'),
  };
  enrichCoachSequence(information);
  return information;
};
