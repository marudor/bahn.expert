/**
 *
 * url: https://live.oebb.at/backend/api/train/<TrainType> <TrainNumber>/stationEva/<EVAId>/departure/<Departure Date as dd.MM.yyyy>
 * example: https://live.oebb.at/backend/api/train/ICE%2028/stationEva/8103000/departure/01.09.2020
 */

export interface OebbWagon {
  ordnungsNummer: number;
  uicNummer: string;
  laengeUeberPuffer: number;
  triebfahrzeug: boolean;
  speisewagen: boolean;
  businessClass: number;
  firstClass: number;
  secondClass: number;
  schlafplaetze: number;
  liegeplaetze: number;
  autoreisezug: boolean;
  kinderspielwagen: boolean;
  kinderkino: boolean;
  rollstuhlgerecht: boolean;
  fahrradmitnahme: boolean;
  abgesperrt: boolean;
  origin: OebbStation;
  destination: OebbStation;
  ruhebereich: boolean;
  infoPoint: boolean;
}

export interface OebbStation {
  name: string;
  evaCode: string;
}

export interface OebbEgress {
  Bahnsteig: string;
  Distanz: number;
  Type: string;
  DB640Code: string;
  name: string;
}

export interface OebbSector {
  sectorName: string;
  length: number;
}

export interface OebbHaltepunkt {
  haltepunktInMeters?: unknown;
  departureDirectionSectorA?: unknown;
}

export interface OebbPlatform {
  platform: string;
  haltepunkt: OebbHaltepunkt;
  sectors: OebbSector[];
  egresses: OebbEgress[];
}

export interface OebbCoachSequence {
  trainName: string;
  /**
   * always true so far?
   */
  hasWifi: boolean;
  scheduledDeparture: string;
  actualDeparture: string | null;
  scheduledArrival: string;
  actualArrival: string | null;
  tranStation: OebbStation;
  platform: OebbPlatform;
  wagons: unknown[];
}
