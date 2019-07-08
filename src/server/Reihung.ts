/* eslint-disable array-callback-return */
/* eslint-disable no-fallthrough */
import {
  BRInfo,
  DetailedBRInfo,
  Fahrzeug,
  Formation,
  Wagenreihung,
} from 'types/reihung';
import { convertToTimeZone } from 'date-fns-timezone';
import { flatten, groupBy, maxBy, minBy } from 'lodash';
import { format } from 'date-fns';
import { getAbfahrten } from './Abfahrten';
import { WagenreihungStation } from 'types/reihungStation';
import axios from 'axios';

// Rausfinden ob alle Teile zum gleichen Ort fahren
function differentDestination(formation: Formation) {
  const groups = formation.allFahrzeuggruppe;

  if (groups.length > 1) {
    const firstDestination = groups[0].zielbetriebsstellename;

    return groups.some(g => g.zielbetriebsstellename !== firstDestination);
  }

  return false;
}

function differentZugunummer(formation: Formation) {
  return formation.allFahrzeuggruppe.length <= 1
    ? false
    : formation.allFahrzeuggruppe.every((nummer, index, array) =>
        index > 0
          ? array[index - 1].verkehrlichezugnummer !==
            nummer.verkehrlichezugnummer
          : true
      );
}

const getDetailedInformation = (br: BRInfo): undefined | DetailedBRInfo => {
  if (br.BR) {
    switch (br.BR) {
      // ICE 4
      case '412':
        return {
          comfort: ['11', '7'],
          quiet: ['14', '3', '2'],
          toddler: ['9'],
        };
      // ICE 1
      case '401':
        return {
          comfort: ['11', '7'],
          quiet: ['12', '4', '2'],
          toddler: ['9'],
        };
      // ICE 2
      case '402':
        return {
          comfort: ['26', '36', '28', '38'],
          quiet: ['27', '37', '22', '32'],
          toddler: ['24', '34'],
        };
      // ICE 3
      case '403':
      // ICE 3
      case '406':
        return {
          comfort: ['28', '38', '27', '37'],
          quiet: ['28', '38', '29', '39', '21', '31'],
          toddler: ['25', '35'],
        };
      // ICE 3 Velaro
      case '407':
        return {
          comfort: ['26', '36', '25', '35'],
          quiet: ['29', '39', '21', '31'],
          toddler: ['25', '35'],
        };
      // ICE T
      case '411':
        return {
          comfort: ['28', '38', '27', '37'],
          quiet: ['28', '38', '22', '32', '21', '31'],
          toddler: ['26', '36'],
        };
      // ICE T
      case '415':
        return {
          comfort: ['28', '38', '23', '33'],
          quiet: ['28', '38', '21', '31'],
          toddler: ['27', '37'],
        };
    }
  } else {
    switch (br.name) {
      case 'MET':
        return {
          comfort: ['5', '6'],
          quiet: ['1', '7'],
        };
      case 'IC 2':
        return {
          comfort: ['4', '5'],
          quiet: ['5'],
          toddler: ['1'],
        };
    }
  }
};

const getATBR = (
  code: string,
  _serial: string,
  _fahrzeugTypes: string[]
): undefined | BRInfo => {
  switch (code) {
    case '4011':
      return {
        name: 'ICE T',
        BR: '411',
        serie: '1',
      };
  }
};
const getDEBR = (
  code: string,
  serial: string,
  fahrzeugTypes: string[]
): undefined | BRInfo => {
  const numberSerial = Number.parseInt(serial, 10);

  switch (code) {
    case '0812':
    case '1412':
    case '1812':
    case '2412':
    case '2812':
    case '3412':
    case '4812':
    case '5812':
    case '6412':
    case '6812':
    case '7412':
    case '7812':
    case '8812':
    case '9412':
    case '9812':
      return {
        name: 'ICE 4',
        BR: '412',
      };
    case '5401':
    case '5801':
    case '5802':
    case '5803':
    case '5804':
      return {
        name: 'ICE 1',
        BR: '401',
      };
    case '5402':
    case '5805':
    case '5806':
    case '5807':
    case '5808':
      return {
        name: 'ICE 2',
        BR: '402',
      };
    case '5403':
      return {
        name: 'ICE 3',
        BR: '403',
        serie: numberSerial <= 37 ? '1' : '2',
        redesign: fahrzeugTypes.includes('WRmz'),
      };
    case '5406':
      return {
        name: 'ICE 3',
        BR: '406',
      };
    case '5407':
      return {
        name: 'ICE 3 Velaro',
        BR: '407',
      };
    case '5410':
      return {
        name: 'ICE S',
        BR: '410.1',
        noPdf: true,
      };
    case '5411':
      return {
        name: 'ICE T',
        BR: '411',
        serie: numberSerial <= 32 ? '1' : '2',
      };
    case '5415':
      return {
        name: 'ICE T',
        BR: '415',
      };
    case '5475':
      return {
        name: 'TGV',
        noPdf: true,
      };
  }
};
const getSpecificBR = (
  fahrzeugnummer: string,
  fahrzeugTypes: string[]
): undefined | BRInfo => {
  const country = fahrzeugnummer.substr(2, 2);
  const code = fahrzeugnummer.substr(4, 4);
  const serial = fahrzeugnummer.substr(8, 3);
  let info;

  switch (country) {
    case '80':
      info = getDEBR(code, serial, fahrzeugTypes);
      break;
    case '81':
      info = getATBR(code, serial, fahrzeugTypes);
      break;
  }

  return info;
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
  const countries = fahrzeuge.map(f => {
    const countryCode = Number.parseInt(f.fahrzeugnummer.substr(2, 2), 10);

    if (countryCode) {
      return countryMapping[countryCode] || countryCode;
    }
  });

  const firstCountry = countries.filter(Boolean)[0];

  if (firstCountry) {
    return firstCountry;
  }

  const wagenOrdnungsNummern = fahrzeuge.map(f =>
    Number.parseInt(f.wagenordnungsnummer, 10)
  );
  const minOrdnungsnummer = minBy(wagenOrdnungsNummern) as number;
  const maxOrdnungsnummer = maxBy(wagenOrdnungsNummern) as number;
  const groupedFahrzeugTypes = groupBy(fahrzeugTypes);

  if (
    fahrzeuge.length > 10 &&
    minOrdnungsnummer >= 253 &&
    maxOrdnungsnummer <= 264 &&
    fahrzeuge.every(f => CHICWagons.includes(f.fahrzeugtyp))
  ) {
    return 'CH';
  } else if (
    minOrdnungsnummer >= 255 &&
    maxOrdnungsnummer <= 263 &&
    groupedFahrzeugTypes.Bdmpz &&
    groupedFahrzeugTypes.Bdmpz.length === 1 &&
    groupedFahrzeugTypes.Bhmpz &&
    groupedFahrzeugTypes.Bhmpz.length === 1
  ) {
    return 'CZ';
  } else if (minOrdnungsnummer === 81 && maxOrdnungsnummer === 82) {
    return 'DK';
  }
};

// Reihenfolge wichtig! Wenn nicht eines der oberen DANN sind die unteren "unique"
const ICETspecific = ['ABpmz', 'Bpmkz'];
const ICE4specific = ['Bpmdz', 'Bpmdzf'];
const ICE3Velarospecific = ['ARmz'];
const ICE3specific = ['Apmzf', 'Bpmbz', 'BRmz'];
const METspecific = ['Apmbzf'];
const ICE2specific = ['Apmz', 'Bpmz'];
const ICE1specific = ['Avmz', 'Bvmbz', 'Bvmz'];
// Rausfinden was für ein ICE es genau ist

function brByFahrzeuge(fahrzeuge: Fahrzeug[]) {
  const wagenTypes = fahrzeuge.map(f => f.fahrzeugtyp);

  if (wagenTypes.some(t => ICETspecific.includes(t))) {
    return {
      name: 'ICE T',
      BR: fahrzeuge.length === 5 ? '415' : '411',
    };
  }

  if (fahrzeuge.length > 10 && wagenTypes.some(t => ICE4specific.includes(t))) {
    return {
      name: 'ICE 4',
      BR: '412',
    };
  }

  if (wagenTypes.some(t => ICE3Velarospecific.includes(t))) {
    return {
      name: 'ICE 3 Velaro',
      BR: '406',
    };
  }

  const triebboepfe = fahrzeuge.filter(
    f => f.kategorie === 'LOK' || f.kategorie === 'TRIEBKOPF'
  );

  if (triebboepfe.length === 1) {
    return {
      name: 'ICE 2',
      BR: '403',
    };
  }
  if (triebboepfe.length === 2) {
    return {
      name: 'ICE 1',
      BR: '401',
    };
  }

  if (wagenTypes.some(t => METspecific.includes(t))) {
    return {
      name: 'MET',
      pdf: 'MET',
      comfort: ['5', '6'],
    };
  }

  if (wagenTypes.some(t => ICE3specific.includes(t))) {
    const BR = wagenTypes.some(t => t === 'Apmz') ? '407' : '403';
    const redesign = wagenTypes.some(t => t === 'WRmz');

    return {
      name: 'ICE 3',
      BR,
      redesign,
      noPdf: BR === '403' && !redesign,
    };
  }
  if (wagenTypes.some(t => ICE2specific.includes(t))) {
    return {
      name: 'ICE 2',
      BR: '403',
    };
  }
  if (wagenTypes.some(t => ICE1specific.includes(t))) {
    return {
      name: 'ICE 1',
      BR: '401',
    };
  }
}

const specificBR = (
  fahrzeuge: Fahrzeug[],
  fahrzeugTypes: string[],
  formation: Formation
) => {
  for (const f of fahrzeuge) {
    const br = getSpecificBR(f.fahrzeugnummer, fahrzeugTypes);

    if (br) return br;
  }

  if (fahrzeuge.find(f => f.fahrzeugtyp === 'Apmbzf')) {
    return {
      name: 'MET',
      pdf: 'MET',
    };
  } else if (fahrzeuge.find(f => f.fahrzeugtyp === 'DBpbzfa')) {
    return {
      name: 'IC 2',
      pdf: 'IC2',
    };
  }

  if (formation.zuggattung === 'ICE') {
    const br = brByFahrzeuge(fahrzeuge);

    if (br) {
      return br;
    }
  }

  const fallback: BRInfo = { name: formation.zuggattung, noPdf: true };

  if (formation.zuggattung === 'IC') {
    fallback.comfort = ['12', '10'];
    fallback.toddler = ['Bvmmsz', 'Bvmsz'];
  }

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

// https://www.apps-bahn.de/wr/wagenreihung/1.0/6/201802021930
export async function wagenReihung(trainNumber: string, date: number) {
  const parsedDate = format(
    convertToTimeZone(new Date(date), { timeZone: 'Europe/Berlin' }),
    'yyyyMMddHHmm'
  );

  const info: Wagenreihung = (await axios.get(
    `https://www.apps-bahn.de/wr/wagenreihung/1.0/${trainNumber}/${parsedDate}`
  )).data;

  const fahrzeuge = flatten(
    info.data.istformation.allFahrzeuggruppe.map(g => g.allFahrzeug)
  );

  let startPercentage = 100;
  let endPercentage = 0;

  const isActuallyIC =
    info.data.istformation.zuggattung === 'ICE' &&
    info.data.istformation.allFahrzeuggruppe.some(
      g => g.allFahrzeug.length === 1 && g.allFahrzeug[0].fahrzeugtyp === 'E'
    );

  if (isActuallyIC) {
    info.data.istformation.reportedZuggattung =
      info.data.istformation.zuggattung;
    info.data.istformation.zuggattung = 'IC';
  }

  info.data.istformation.allFahrzeuggruppe.forEach(g => {
    const minFahrzeug = minBy(g.allFahrzeug, f =>
      Number.parseInt(f.positionamhalt.startprozent, 10)
    );
    const maxFahrzeug = maxBy(g.allFahrzeug, f =>
      Number.parseInt(f.positionamhalt.endeprozent, 10)
    );

    if (minFahrzeug) {
      g.startProzent = Number.parseInt(
        minFahrzeug.positionamhalt.startprozent,
        10
      );
    }
    if (maxFahrzeug) {
      g.endeProzent = Number.parseInt(
        maxFahrzeug.positionamhalt.endeprozent,
        10
      );
    }

    const gruppenFahrzeugTypes = g.allFahrzeug.map(f => f.fahrzeugtyp);

    g.br = specificBR(
      g.allFahrzeug,
      gruppenFahrzeugTypes,
      info.data.istformation
    );
    if (g.br) {
      Object.assign(g.br, getDetailedInformation(g.br));
      g.br.country = getCountry(g.allFahrzeug, gruppenFahrzeugTypes);
      g.br.showBRInfo = Boolean(
        g.br.BR || !g.br.noPdf || (g.br.country && g.br.country !== 'DE')
      );
    }
  });

  info.data.istformation.differentDestination = differentDestination(
    info.data.istformation
  );
  info.data.istformation.differentZugnummer = differentZugunummer(
    info.data.istformation
  );
  info.data.istformation.realFahrtrichtung = fahrtrichtung(fahrzeuge);
  const reallyHasReihung = info.data.istformation.allFahrzeuggruppe.every(g =>
    g.allFahrzeug.every(f => {
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
    })
  );

  if (!reallyHasReihung) {
    throw { status: 404 };
  }

  info.data.istformation.scale = 100 / (endPercentage - startPercentage);
  info.data.istformation.startPercentage = startPercentage;
  info.data.istformation.endPercentage = endPercentage;

  return info.data.istformation;
}

// https://ws.favendo.de/wagon-order/rest/v1/si/1401
export async function wagenReihungStation(
  trainNumbers: string[],
  station: string
) {
  const info: WagenreihungStation = (await axios.post(
    `https://ws.favendo.de/wagon-order/rest/v1/si/${station}`,
    trainNumbers.map(trainNumber => ({
      trainNumber,
    }))
  )).data;

  return info;
}

function wagenReihungSpecificMonitoring(id: string, departure: number) {
  return wagenReihung(id, departure);
}

export async function wagenReihungMonitoring() {
  const abfahrten = await getAbfahrten('8002549', false, {
    lookahead: 300,
  });
  const maybeDepartures = abfahrten.departures.filter(
    d => d.reihung && d.departure
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
          departureTime
        );

        if (wr) return wr;
        departure = maybeDepartures.shift();
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn(
          'Failed to get WR for Monitoring!',
          e,
          departure && departure.train
        );
        departure = maybeDepartures.shift();
      }
    }
  }
}
