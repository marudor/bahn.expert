/* eslint-disable array-callback-return */
/* eslint-disable no-fallthrough */
import { format } from 'date-fns';
import { getAbfahrten } from 'server/iris';
import {
  getComfortSeats,
  getDisabledSeats,
  getFamilySeats,
} from 'server/Reihung/specialSeats';
import { getName } from 'server/Reihung/identifierNameMap';
import { isRedesignByTZ } from 'server/Reihung/tzInfo';
import { maxBy, minBy } from 'client/util';
import { utcToZonedTime } from 'date-fns-tz';
import Axios from 'axios';
import getBR from 'server/Reihung/getBR';
import TrainNames from 'server/Reihung/TrainNames';
import type {
  AdditionalFahrzeugInfo,
  BRInfo,
  Fahrzeug,
  Fahrzeuggruppe,
  Formation,
  Wagenreihung,
} from 'types/reihung';

const formatDate = (date: Date) =>
  format(utcToZonedTime(date, 'Europe/Berlin'), 'yyyyMMddHHmm');

const wrUrls = {
  apps: 'https://www.apps-bahn.de/wr/wagenreihung/1.0',
  noncd: 'https://ist-wr.noncd.db.de/wagenreihung/1.0',
};
export const getWRLink = (
  trainNumber: string,
  date: Date,
  type: 'apps' | 'noncd' = 'noncd',
): string => {
  return `${wrUrls[type]}/${trainNumber}/${formatDate(date)}`;
};

const countryMapping: any = {
  80: 'DE',
  81: 'AT',
  83: 'IT',
  84: 'NL',
  85: 'CH',
  86: 'DK',
  87: 'FR',
};
const CHICWagons = ['Apmz', 'WRmz', 'Bpmz'];
const getCountry = (fahrzeuge: Fahrzeug[], fahrzeugTypes: string[]) => {
  const countries = fahrzeuge.map((f) => {
    const countryCode = Number.parseInt(f.fahrzeugnummer.substr(2, 2), 10);

    if (countryCode) {
      return countryMapping[countryCode] || countryCode;
    }
  });

  const firstCountry = countries.filter(Boolean)[0];

  if (firstCountry) {
    return firstCountry;
  }

  const wagenOrdnungsNummern = fahrzeuge.map((f) =>
    Number.parseInt(f.wagenordnungsnummer, 10),
  );
  const minOrdnungsnummer = minBy(wagenOrdnungsNummern)!;
  const maxOrdnungsnummer = maxBy(wagenOrdnungsNummern)!;
  const groupedFahrzeugTypes = fahrzeugTypes.reduce<{
    [key: string]: number;
  }>((agg, current) => {
    if (current in agg) agg[current] += 1;
    else agg[current] = 1;
    return agg;
  }, {});

  if (
    fahrzeuge.length > 10 &&
    minOrdnungsnummer >= 253 &&
    maxOrdnungsnummer <= 264 &&
    fahrzeuge.every((f) => CHICWagons.includes(f.fahrzeugtyp))
  ) {
    return 'CH';
  } else if (
    minOrdnungsnummer >= 255 &&
    maxOrdnungsnummer <= 263 &&
    groupedFahrzeugTypes.Bdmpz === 1 &&
    groupedFahrzeugTypes.Bhmpz === 1
  ) {
    return 'CZ';
  } else if (
    (minOrdnungsnummer === 81 && maxOrdnungsnummer === 82) ||
    (minOrdnungsnummer === 71 && maxOrdnungsnummer === 72)
  ) {
    return 'DK';
  }
};

const specificBR = (fahrzeuge: Fahrzeug[]): Omit<BRInfo, 'name'> => {
  for (const f of fahrzeuge) {
    const br = getBR(f.fahrzeugnummer, fahrzeuge);

    if (br) return br;
  }

  if (fahrzeuge.find((f) => f.fahrzeugtyp === 'Apmbzf')) {
    return {
      identifier: 'MET',
    };
  } else if (fahrzeuge.find((f) => f.fahrzeugtyp === 'DBpbzfa')) {
    return {
      identifier: 'IC2.TWIN',
    };
  } else if (fahrzeuge.find((f) => f.fahrzeugtyp === 'DBpdzfa')) {
    fahrzeuge.forEach((f) => {
      switch (f.fahrzeugtyp) {
        case 'DABpzfa':
          f.additionalInfo.comfort = true;
          f.additionalInfo.icons.disabled = true;
          break;
        case 'DBpbza':
          f.additionalInfo.icons.family = true;
          break;
        case 'DBpdzfa':
          f.additionalInfo.icons.bike = true;
          break;
      }
    });
    return {
      identifier: 'IC2.KISS',
      noPdf: true,
    };
  }

  return { noPdf: true };
};

function fahrtrichtung(fahrzeuge: Fahrzeug[]) {
  const first = fahrzeuge[0];
  const last = fahrzeuge[fahrzeuge.length - 1];

  // "Algorithmus" so bei der DB im Code gefunden
  return (
    Number.parseInt(last.positionamhalt.startprozent, 10) >
    Number.parseInt(first.positionamhalt.startprozent, 10)
  );
}

const tznRegex = /(\d+)/;

function enrichFahrzeug(fahrzeug: Fahrzeug) {
  const data: AdditionalFahrzeugInfo = {
    klasse: 0,
    icons: {},
  };

  switch (fahrzeug.kategorie) {
    case 'DOPPELSTOCKSTEUERWAGENZWEITEKLASSE':
    case 'DOPPELSTOCKWAGENZWEITEKLASSE':
    case 'REISEZUGWAGENZWEITEKLASSE':
    case 'STEUERWAGENZWEITEKLASSE':
      data.klasse = 2;
      break;
    case 'HALBSPEISEWAGENZWEITEKLASSE':
    case 'SPEISEWAGEN':
      data.klasse = 2;
      data.icons.dining = true;
      break;
    default:
      break;
    case 'DOPPELSTOCKWAGENERSTEZWEITEKLASSE':
    case 'DOPPELSTOCKSTEUERWAGENERSTEZWEITEKLASSE':
    case 'STEUERWAGENERSTEZWEITEKLASSE':
    case 'REISEZUGWAGENERSTEZWEITEKLASSE':
      data.klasse = 3;
      break;
    case 'HALBSPEISEWAGENERSTEKLASSE':
      data.klasse = 1;
      data.icons.dining = true;
      break;
    case 'DOPPELSTOCKWAGENERSTEKLASSE':
    case 'REISEZUGWAGENERSTEKLASSE':
    case 'STEUERWAGENERSTEKLASSE':
      data.klasse = 1;
      break;
    case 'TRIEBKOPF':
    case 'LOK':
      data.klasse = 4;
  }

  fahrzeug.allFahrzeugausstattung.forEach((ausstattung) => {
    switch (ausstattung.ausstattungsart) {
      case 'PLAETZEROLLSTUHL':
        data.icons.wheelchair = true;
        break;
      case 'PLAETZEFAHRRAD':
        data.icons.bike = true;
        break;
      case 'BISTRO':
        data.icons.dining = true;
        break;
      case 'RUHE':
        data.icons.quiet = true;
        break;
      case 'FAMILIE':
        data.icons.family = true;
        break;
      case 'PLAETZEBAHNCOMFORT':
        data.comfort = true;
        break;
      case 'PLAETZESCHWERBEH':
        data.icons.disabled = true;
        break;
      case 'INFO':
        data.icons.info = true;
        break;
      case 'ABTEILKLEINKIND':
        data.icons.toddler = true;
        break;
    }
  });

  fahrzeug.additionalInfo = data;
}

export function addBRtoGruppe(
  gruppe: Fahrzeuggruppe,
  formation: Formation,
): void {
  if (['IC', 'EC', 'ICE', 'ECE'].includes(formation.zuggattung)) {
    const gruppenFahrzeugTypes = gruppe.allFahrzeug.map((f) => f.fahrzeugtyp);

    const br = specificBR(gruppe.allFahrzeug);
    if (gruppe.fahrzeuggruppebezeichnung.startsWith('IC')) {
      const tzn = gruppe.fahrzeuggruppebezeichnung;

      gruppe.tzn = tznRegex.exec(tzn)?.[0];
      gruppe.name = TrainNames(gruppe.tzn);

      if (br?.identifier && isRedesignByTZ(gruppe.tzn)) {
        // @ts-expect-error this works
        br.identifier = br.identifier.replace('.S1', '').replace('.S2', '');
        br.identifier += '.R';
      }
    }
    gruppe.br = {
      ...br,
      name: getName(br) ?? formation.zuggattung,
    };
    if (gruppe.br) {
      gruppe.br.country = getCountry(gruppe.allFahrzeug, gruppenFahrzeugTypes);
      gruppe.br.showBRInfo = Boolean(gruppe.br.BR || !gruppe.br.noPdf);
    }
  }
}

export function calculateComfort(
  fahrzeug: Fahrzeug,
  gruppe: Fahrzeuggruppe,
): void {
  const data = fahrzeug.additionalInfo;
  if (gruppe.goesToFrance) {
    data.comfort = false;
    data.icons.disabled = false;
    data.icons.family = false;
  }

  if (gruppe.br?.name === 'MET') {
    if (
      fahrzeug.wagenordnungsnummer === '5' ||
      fahrzeug.wagenordnungsnummer === '6'
    ) {
      data.comfort = true;
    }
    if (fahrzeug.fahrzeugtyp === 'Bpmz') {
      fahrzeug.fahrzeugtyp = 'Apmz';
    }
  }

  if (gruppe.br) {
    if (data.comfort) {
      data.comfortSeats = getComfortSeats(gruppe.br, data.klasse);
    }
    if (data.icons.disabled) {
      data.disabledSeats = getDisabledSeats(
        gruppe.br,
        data.klasse,
        fahrzeug.wagenordnungsnummer,
      );
    }
    if (data.icons.family) {
      data.familySeats = getFamilySeats(gruppe.br);
    }
  }
}

const wrFetchTimeout = process.env.NODE_ENV === 'production' ? 2500 : 10000;

async function getBestReihung(trainNumber: string, date: Date) {
  if (trainNumber.length <= 4) {
    try {
      const cancelToken = new Axios.CancelToken((c) => {
        setTimeout(c, wrFetchTimeout);
      });
      const info = (
        await Axios.get<Wagenreihung>(getWRLink(trainNumber, date), {
          cancelToken,
        })
      ).data;
      return info;
    } catch {
      // we just ignore it and try the next one
    }
  }
  const cancelToken = new Axios.CancelToken((c) => {
    setTimeout(c, wrFetchTimeout);
  });
  const info = (
    await Axios.get<Wagenreihung>(getWRLink(trainNumber, date, 'apps'), {
      cancelToken,
    })
  ).data;
  return info;
}
// https://www.apps-bahn.de/wr/wagenreihung/1.0/6/201802021930
export async function wagenreihung(
  trainNumber: string,
  date: Date,
  retry = 2,
): Promise<Formation> {
  let info: Wagenreihung;

  try {
    info = await getBestReihung(trainNumber, date);
  } catch (e) {
    if (Axios.isCancel(e)) {
      if (retry) return wagenreihung(trainNumber, date, retry - 1);
      throw {
        response: {
          status: 404,
          statusText: 'Timeout',
          data: 404,
        },
      };
    }

    throw {
      response: {
        status: 404,
        statusText: 'Not Found',
        data: 404,
      },
    };
  }

  // @ts-expect-error We're enriching information now.
  const enrichedFormation: Formation = info.data.istformation;

  let startPercentage = 100;
  let endPercentage = 0;

  const reallyHasReihung = enrichedFormation.allFahrzeuggruppe.every((g) =>
    g.allFahrzeug.every((f) => {
      const start = Number.parseFloat(f.positionamhalt.startprozent);
      const end = Number.parseFloat(f.positionamhalt.endeprozent);

      if (!start && !end) return false;

      if (start < startPercentage) {
        startPercentage = start;
      }
      if (end > endPercentage) {
        endPercentage = end;
      }

      return true;
    }),
  );

  if (!reallyHasReihung) {
    throw { status: 404, statusText: 'Data invalid' };
  }

  const isActuallyIC =
    enrichedFormation.zuggattung === 'ICE' &&
    enrichedFormation.allFahrzeuggruppe.some(
      (g) =>
        g.allFahrzeug.length === 1 &&
        g.allFahrzeug[0].fahrzeugtyp.startsWith('E'),
    );

  if (isActuallyIC) {
    enrichedFormation.reportedZuggattung = enrichedFormation.zuggattung;
    enrichedFormation.zuggattung = 'IC';
  }

  const fahrzeuge: Fahrzeug[] = [];

  enrichedFormation.differentDestination = false;
  enrichedFormation.differentZugnummer = false;
  enrichedFormation.allFahrzeuggruppe.forEach((g, index, gruppen) => {
    if (index > 0) {
      const previousGruppe = gruppen[index - 1];

      if (previousGruppe.verkehrlichezugnummer !== g.verkehrlichezugnummer) {
        enrichedFormation.differentZugnummer = true;
      }
      if (previousGruppe.zielbetriebsstellename !== g.zielbetriebsstellename) {
        enrichedFormation.differentDestination = true;
      }
    }
    g.allFahrzeug.forEach((fahrzeug) => {
      enrichFahrzeug(fahrzeug);
      fahrzeuge.push(fahrzeug);
    });

    addBRtoGruppe(g, enrichedFormation);

    // https://inside.bahn.de/entstehung-zugnummern/?dbkanal_006=L01_S01_D088_KTL0006_INSIDE-BAHN-2019_Zugnummern_LZ01
    const trainNumberAsNumber = Number.parseInt(g.verkehrlichezugnummer, 10);

    g.goesToFrance = trainNumberAsNumber >= 9550 && trainNumberAsNumber <= 9599;

    g.allFahrzeug.forEach((f) => {
      calculateComfort(f, g);
    });

    const minFahrzeug = minBy(g.allFahrzeug, (f) =>
      Number.parseInt(f.positionamhalt.startprozent, 10),
    );
    const maxFahrzeug = maxBy(g.allFahrzeug, (f) =>
      Number.parseInt(f.positionamhalt.endeprozent, 10),
    );

    if (minFahrzeug) {
      g.startPercentage = Number.parseInt(
        minFahrzeug.positionamhalt.startprozent,
        10,
      );
    }
    if (maxFahrzeug) {
      g.endPercentage = Number.parseInt(
        maxFahrzeug.positionamhalt.endeprozent,
        10,
      );
    }
  });

  enrichedFormation.realFahrtrichtung = fahrtrichtung(fahrzeuge);

  enrichedFormation.scale = 100 / (endPercentage - startPercentage);
  enrichedFormation.startPercentage = startPercentage;
  enrichedFormation.endPercentage = endPercentage;
  enrichedFormation.isRealtime = fahrzeuge.every(
    (f) => f.kategorie === 'LOK' || f.fahrzeugnummer,
  );

  return enrichedFormation;
}

function wagenReihungSpecificMonitoring(id: string, departure: Date) {
  return wagenreihung(id, departure);
}

export async function wagenReihungMonitoring(): Promise<Formation | undefined> {
  const abfahrten = await getAbfahrten('8002549', false, {
    lookahead: 300,
  });
  const maybeDepartures = abfahrten.departures.filter(
    (d) => d.reihung && d.departure,
  );

  let departure = maybeDepartures.shift();

  while (departure) {
    const departureTime =
      departure.departure && departure.departure.scheduledTime;

    if (!departureTime) {
      departure = maybeDepartures.shift();
    } else {
      try {
        // eslint-disable-next-line no-await-in-loop
        const wr = await wagenReihungSpecificMonitoring(
          departure.train.number,
          departureTime,
        );

        if (wr) return wr;
        departure = maybeDepartures.shift();
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn(
          'Failed to get WR for Monitoring!',
          e,
          departure && departure.train,
        );
        departure = maybeDepartures.shift();
      }
    }
  }
}
