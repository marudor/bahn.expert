// @flow
import { flatten } from 'lodash';
import axios from 'axios';
import type { Fahrzeug, Formation, Wagenreihung } from 'types/reihung';
import type { WagenreihungStation } from 'types/reihungStation';

// Rausfinden ob alle Teile zum gleichen Ort fahren
function differentDestination(formation: Formation) {
  const groups = formation.allFahrzeuggruppe;

  if (groups.length > 1) {
    const firstDestination = groups[0].zielbetriebsstellename;

    return groups.some(g => g.zielbetriebsstellename !== firstDestination);
  }

  return false;
}

// Reihenfolge wichtig! Wenn nicht eines der oberen DANN sind die unteren "unique"
const ICETspecific = ['ABpmz', 'Bpmkz'];
const ICE4specific = ['Bpmdz', 'Bpmdzf'];
const ICE3Velarospecific = ['ARmz'];
const ICE3specific = ['Apmzf', 'Bpmbz', 'BRmz'];
const METspecific = ['Apmbzf'];
const ICE2specific = ['Apmz', 'Bpmz'];
const ICE1specific = ['Avmz', 'Bvmbz', 'Bvmz'];
const IC2specific = ['DBpbzfa', 'DBpza'];
// Rausfinden was für ein ICE es genau ist

function specificTrainType(formation: Formation, fahrzeuge: Fahrzeug[]) {
  const wagenTypes = fahrzeuge.map(f => f.fahrzeugtyp);
  const groupLength = formation.allFahrzeuggruppe.length;

  if (formation.zuggattung === 'IC') {
    if (wagenTypes.some(t => IC2specific.includes(t))) {
      return 'IC2';
    }
  } else if (formation.zuggattung === 'ICE') {
    if (wagenTypes.some(t => ICETspecific.includes(t))) {
      if (fahrzeuge.length / groupLength === 5) {
        return 'ICET415';
      }

      return 'ICET411';
    }

    if (groupLength === 1) {
      if (wagenTypes.some(t => ICE4specific.includes(t))) {
        return 'ICE4';
      }
    }

    if (wagenTypes.some(t => ICE3Velarospecific.includes(t))) {
      return 'ICE3V';
    }

    const triebboepfe = fahrzeuge.filter(f => f.kategorie === 'LOK' || f.kategorie === 'TRIEBKOPF');
    const tkPerGroup = triebboepfe.length / groupLength;

    if (tkPerGroup === 1) {
      return 'ICE2';
    }
    if (tkPerGroup === 2) {
      return 'ICE1';
    }

    if (wagenTypes.some(t => METspecific.includes(t))) {
      return 'MET';
    }

    if (wagenTypes.some(t => ICE3specific.includes(t))) {
      return 'ICE3';
    }
    if (wagenTypes.some(t => ICE2specific.includes(t))) {
      return 'ICE2';
    }
    if (wagenTypes.some(t => ICE1specific.includes(t))) {
      return 'ICE1';
    }
  }

  return null;
}

function fahrtrichtung(fahrzeuge: Fahrzeug[]) {
  const first = fahrzeuge[0];
  const last = fahrzeuge[fahrzeuge.length - 1];

  // "Algorithmus" so bei der DB im Code gefunden
  return Number.parseInt(last.positionamhalt.startprozent, 10) > Number.parseInt(first.positionamhalt.startprozent, 10);
}

// https://www.apps-bahn.de/wr/wagenreihung/1.0/6/201802021930
export async function wagenReihung(trainNumber: string, date: string) {
  const info: Wagenreihung = (await axios.get(`https://www.apps-bahn.de/wr/wagenreihung/1.0/${trainNumber}/${date}`))
    .data;

  const fahrzeuge = flatten(info.data.istformation.allFahrzeuggruppe.map(g => g.allFahrzeug));

  let startPercentage = 100;
  let endPercentage = 0;

  info.data.istformation.differentDestination = differentDestination(info.data.istformation);
  info.data.istformation.specificTrainType = specificTrainType(info.data.istformation, fahrzeuge);
  info.data.istformation.realFahrtrichtung = fahrtrichtung(fahrzeuge);
  info.data.istformation.allFahrzeuggruppe.forEach(g => {
    g.allFahrzeug.forEach(f => {
      const start = Number.parseInt(f.positionamhalt.startprozent, 10);
      const end = Number.parseInt(f.positionamhalt.endeprozent, 10);

      if (start < startPercentage) {
        startPercentage = start;
      }
      if (end > endPercentage) {
        endPercentage = end;
      }
    });
  });

  info.data.istformation.scale = 100 / (endPercentage - startPercentage);
  info.data.istformation.startPercentage = startPercentage;
  info.data.istformation.endPercentage = endPercentage;

  return info;
}

// https://ws.favendo.de/wagon-order/rest/v1/si/1401
export async function wagenReihungStation(trainNumbers: string[], station: number) {
  const info: WagenreihungStation = (await axios.post(
    `https://ws.favendo.de/wagon-order/rest/v1/si/${station}`,
    trainNumbers.map(trainNumber => ({
      trainNumber,
    }))
  )).data;

  return info;
}
