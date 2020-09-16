/* eslint-disable array-callback-return */
/* eslint-disable no-fallthrough */
import { getAbfahrten } from 'server/iris';
import { getWRLink, WRCache } from 'server/Reihung/hasWR';
import { isRedesignByTZ, isRedesignByUIC } from 'server/Reihung/tzInfo';
import { maxBy, minBy } from 'client/util';
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
  } else if (minOrdnungsnummer === 81 && maxOrdnungsnummer === 82) {
    return 'DK';
  }
};

const ICE1LDV = (br: BRInfo, fahrzeuge: Fahrzeug[]): void => {
  if (br.BR === '401' && fahrzeuge.length === 11) {
    br.name += ' LDV';
    br.noPdf = true;
  }
};

const specificBR = (fahrzeuge: Fahrzeug[], formation: Formation): BRInfo => {
  for (const f of fahrzeuge) {
    const br = getBR(f.fahrzeugnummer);

    if (br) return br;
  }

  if (fahrzeuge.find((f) => f.fahrzeugtyp === 'Apmbzf')) {
    return {
      name: 'MET',
      pdf: 'MET',
    };
  } else if (fahrzeuge.find((f) => f.fahrzeugtyp === 'DBpbzfa')) {
    return {
      name: 'IC 2',
      pdf: 'IC2',
    };
  }

  const fallback: BRInfo = { name: formation.zuggattung, noPdf: true };

  return fallback;
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

const getComfortSeats = (br: BRInfo, klasse: 1 | 2) => {
  switch (br.BR) {
    case '401':
      return klasse === 1 ? '11-36' : '11-57';
    case '402':
      return klasse === 1 ? '11-16, 21, 22' : '81-108';
    case '403':
    case '406':
      if (klasse === 1) return '12-26';

      return br.redesign ? '11-37' : '11-38';
    case '407':
      return klasse === 1 ? '21-26, 31, 33, 35' : '31-55, 57';
    case '411':
      return klasse === 1 ? '41, 46, 52, 54-56' : '92, 94, 96, 98, 101-118';
    case '412':
      return klasse === 1 ? '11-46' : '11-68';
    case '415':
      return klasse === 1 ? '52, 54, 56' : '81-88, 91-98';
  }

  switch (br.name) {
    case 'MET':
      return klasse === 1 ? '61-66' : '91-106';
    case 'IC 2':
      return klasse === 1 ? '73, 75, 83-86' : '31-38, 41-45, 47';
  }
};

const getDisabledSeats = (
  br: BRInfo,
  klasse: 1 | 2,
  wagenordnungsnummer: string,
) => {
  switch (br.BR) {
    case '401':
      return klasse === 1 ? '51, 52, 53, 55' : '111-116';
    case '402':
      return klasse === 1 ? '12, 21' : '81, 85-88';

    case '403':
      // 406 has no seat 64/66 Looks like no disabled seats either. At least for trains going to Amsterdam/NL
      // case '406':
      if (klasse === 1) return '64, 66';
      if (wagenordnungsnummer === '25' || wagenordnungsnummer === '35') {
        return br.redesign ? '61, 63, 65-67' : '61, 63, 65, 67';
      }

      return '106, 108';
    case '407':
      return klasse === 1 ? '13, 15' : '11, 13, 15, 17';
    case '411':
      return klasse === 1 ? '21, 22' : '15-18';
    case '412':
      if (klasse === 1)
        return wagenordnungsnummer === '10' ? '12, 13' : '11, 14, 21';

      return wagenordnungsnummer === '1' ? '11-24' : '41, 45, 46';
    case '415':
      return klasse === 1 ? '21' : '15, 17';
  }
};

const tznRegex = /(\d+)/;

function enrichFahrzeug(fahrzeug: Fahrzeug, gruppe: Fahrzeuggruppe) {
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

  if (
    gruppe.tzn &&
    gruppe.br &&
    !gruppe.br.redesign &&
    isRedesignByUIC(gruppe.tzn)
  ) {
    gruppe.br.redesign = true;
  }

  if (gruppe.br) {
    if (data.comfort) {
      data.comfortSeats = getComfortSeats(gruppe.br, data.klasse === 1 ? 1 : 2);
    }
    if (data.icons.disabled) {
      data.disabledSeats = getDisabledSeats(
        gruppe.br,
        data.klasse === 1 ? 1 : 2,
        fahrzeug.wagenordnungsnummer,
      );
    }
  }

  fahrzeug.additionalInfo = data;
}

const wrFetchTimeout = process.env.NODE_ENV === 'production' ? 2500 : 10000;
// https://www.apps-bahn.de/wr/wagenreihung/1.0/6/201802021930
export async function wagenreihung(
  trainNumber: string,
  date: number,
  retry = 2,
): Promise<Formation> {
  let info: Wagenreihung;

  try {
    const cancelToken = new Axios.CancelToken((c) => {
      setTimeout(c, wrFetchTimeout);
    });
    info = (
      await Axios.get<Wagenreihung>(getWRLink(trainNumber, date), {
        cancelToken,
      })
    ).data;
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
    if (e.response?.data?.tryThese) {
      if (!(await WRCache.exists(trainNumber))) {
        await WRCache.set(trainNumber, null);
      }
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
      const start = Number.parseInt(f.positionamhalt.startprozent, 10);
      const end = Number.parseInt(f.positionamhalt.endeprozent, 10);

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
    throw { status: 404 };
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
    if (['IC', 'EC', 'ICE', 'ECE'].includes(enrichedFormation.zuggattung)) {
      const gruppenFahrzeugTypes = g.allFahrzeug.map((f) => f.fahrzeugtyp);

      g.br = specificBR(g.allFahrzeug, enrichedFormation);
      if (g.br) {
        ICE1LDV(g.br, g.allFahrzeug);
        g.br.country = getCountry(g.allFahrzeug, gruppenFahrzeugTypes);
        g.br.showBRInfo = Boolean(
          g.br.BR || !g.br.noPdf || (g.br.country && g.br.country !== 'DE'),
        );
      }
    }

    // https://inside.bahn.de/entstehung-zugnummern/?dbkanal_006=L01_S01_D088_KTL0006_INSIDE-BAHN-2019_Zugnummern_LZ01
    const trainNumberAsNumber = Number.parseInt(g.verkehrlichezugnummer, 10);

    g.goesToFrance = trainNumberAsNumber >= 9550 && trainNumberAsNumber <= 9599;
    if (g.fahrzeuggruppebezeichnung.startsWith('IC')) {
      const tzn = g.fahrzeuggruppebezeichnung;

      g.tzn = tznRegex.exec(tzn)?.[0];
      g.name = TrainNames(g.tzn);

      if (g.br && isRedesignByTZ(g.tzn)) {
        g.br.redesign = true;
      }
    }

    g.allFahrzeug.forEach((fahrzeug) => {
      enrichFahrzeug(fahrzeug, g);
      fahrzeuge.push(fahrzeug);
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

function wagenReihungSpecificMonitoring(id: string, departure: number) {
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
