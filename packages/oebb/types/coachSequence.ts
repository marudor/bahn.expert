import type { EvaNumber } from 'types/common';

export interface OEBBCoachSequence {
  trainName: string;
  hasWifi: boolean;
  /** Iso DateTime */
  scheduledDeparture: string | null;
  /** Iso DateTime */
  actualDeparture: string | null;
  /** Iso DateTime */
  scheduledArrival: string | null;
  /** Iso DateTime */
  actualArrival: string | null;
  trainStation: OEBBCoachSequenceTrainStation;
  platform?: OEBBCoachSequencePlatform;
  wagons: OEBBCoachSequenceWagon[];
}

export interface OEBBCoachSequenceTrainStation {
  name: string;
  evaCode: EvaNumber | null;
}

export interface OEBBCoachSequenceWagon {
  ordnungsNummer: number;
  uicNummer?: string;
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
  origin: OEBBCoachSequenceTrainStation;
  destination: OEBBCoachSequenceTrainStation;
  ruhebereich: boolean;
  infoPoint: boolean;
}

export interface OEBBCoachSequencePlatform {
  platform: string;
  haltepunkt: OEBBCoachSequenceHaltepunkt;
  sectors: OEBBCoachSequenceSector[];
  egresses: OEBBCoachSequenceEgress[];
}

export interface OEBBCoachSequenceHaltepunkt {
  haltepunktInMeters: number;
  departureDirectionSectorA: boolean;
}

export interface OEBBCoachSequenceSector {
  sectorName: string;
  length: number;
}

export interface OEBBCoachSequenceEgress {
  Bahnsteig: string;
  Distanz: number;
  Typ: string;
  DB640Code: string;
  Name: string;
}
