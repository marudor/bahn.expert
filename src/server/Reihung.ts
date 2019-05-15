/* eslint-disable no-fallthrough */
import {
  BRInfo,
  Fahrzeug,
  FahrzeugType,
  Formation,
  Wagenreihung,
} from 'types/reihung';
import { convertToTimeZone } from 'date-fns-timezone';
import { flatten, maxBy, minBy } from 'lodash';
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

const getComfort = (br: BRInfo): undefined | string[] => {
  if (br.BR) {
    switch (br.BR) {
      // ICE 4
      case '412':
      // ICE 1
      case '401':
        return ['11', '7'];
      // ICE 2
      case '402':
        return ['26', '36', '28', '38'];
      // ICE 3
      case '403':
      // ICE 3
      case '406':
        return ['28', '38', '27', '37'];
      // ICE 3 Velaro
      case '407':
        return ['26', '36', '25', '35'];
      // ICE T
      case '411':
        return ['28', '38', '27', '37'];
      // ICE T
      case '415':
        return ['28', '38', '23', '33'];
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
        name: 'ICE 3 Velaro',
        BR: '406',
      };
    case '5407':
      return {
        name: 'ICE 3',
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
  if (info) {
    info.comfort = getComfort(info);
  }

  return info;
};

const specificBR = (
  fahrzeuge: Fahrzeug[],
  fahrzeugTypes: string[],
  zuggattung: FahrzeugType
) => {
  for (const f of fahrzeuge) {
    const br = getSpecificBR(f.fahrzeugnummer, fahrzeugTypes);

    if (br) return br;

    if (fahrzeuge.find(f => f.fahrzeugtyp === 'Apmbzf')) {
      return {
        name: 'MET',
        pdf: 'MET',
        comfort: ['5', '6'],
      };
    } else if (fahrzeuge.find(f => f.fahrzeugtyp === 'DBpbzfa')) {
      return {
        name: 'IC 2',
        pdf: 'IC2',
        comfort: ['4', '5'],
      };
    }
  }

  return {
    name: zuggattung,
    noPdf: true,
    comfort: zuggattung === 'IC' ? ['12', '10'] : undefined,
  };
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
      info.data.istformation.zuggattung
    );
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
