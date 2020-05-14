import { CommonRoutingOptions } from 'types/common';
import { RawSBBStation } from 'types/SBB/station';
import { SBBCoordinates } from 'types/SBB/common';

export type SBBBelegung = 'UNKNOWN' | 'LOW' | string;
export interface RoutingOptions extends CommonRoutingOptions {
  start: string;
  destination: string;
  time?: number;
}

export interface SBBRoutingResult {
  verbindungen: SBBVerbindungen[];
  legendOccupancyItems: SBBLegend[];
  legendItems: SBBLegend[];
  legendBfrItems: SBBLegendBfr[];
  abfahrt: RawSBBStation;
  ankunft: RawSBBStation;
}

export interface SBBLegendBfr {}
export interface SBBLegend {
  code: string;
  description: string;
  actions: {};
}

export interface SBBVerbindungen {
  verbindungsSections: SBBVerbindungSection[];
  abfahrt: string;
  ankunft: string;
  vias: null;
  transfers: number;
  duration: string;
  durationAccessibility: string;
  // HH:mm
  abfahrtTime: string;
  // dd.MM.yyyy
  abfahrtDate: string;
  // HH:mm
  ankunftTime: string;
  // dd.MM.yyyy
  ankunftDate: string;
  abfahrtGleis: string;
  departureTrackLabelAccessibility: string;
  departureTrackLabel: string;
  realtimeInfo: SBBRealtimeInfo;
  belegungErste: SBBBelegung;
  belegungZweite: SBBBelegung;
  transportBezeichnung: SBBTransportBezeichnung;
  legendOccupancyItems: SBBLegend[];
  legendBfrItems: SBBLegendBfr[];
  legendItems: SBBLegend[];
  verkehrstage: unknown[];
  serviceAttributes: unknown[];
  verbindungId: string;
  isInternationalVerbindung: boolean;
  zuschlagspflicht: boolean;
  angeboteUrl: string;
  dayDifference: string;
  dayDifferenceAccessibility: string;
  reconstructionContext: string;
  verbindungAbpreisContext: string;
  ticketingInfo: SBBTicketingInfo;
}

export interface SBBTicketingInfo {
  dialogTitle: null;
  dialogMessage: null;
  buttonText: null;
  isAvailable: boolean;
}

export interface SBBRealtimeInfo {
  icon?: unknown;
  detailMsg?: unknown;
  cancellationMsg?: unknown;
  platformChange?: unknown;
  nextAlternative?: unknown;
  isAlternative?: boolean;
  // HH:mm
  abfahrtIstZeit: string;
  // dd.MM.yyyy
  abfahrtIstDatum: string;
  // HH:mm
  ankunftIstZeit: string;
  // dd.MM.yyyy
  ankunftIstDaum: string;
  abfahrtPlatformChange?: boolean;
  abfahrtDelayUndefined?: boolean;
  ankunftCancellation?: boolean;
  ankunftDelayUndefined?: boolean;
  ankunftPlatformChange?: boolean;
  abfahrtCancellation?: boolean;
}

export interface SBBTransportBezeichnung {
  oevIcon: string;
  transportIcon: string;
  transportIconSuffix: string;
  transportLabel: string;
  transportText: string;
  transportName: null;
  transportDirection: string;
  transportLabelBgColor: null;
  transportLabelTextColor: null;
}

export interface SBBVerbindungSection {
  // HH:mm
  abfahrtTime: string;
  // dd.MM.yyyy
  abfahrtDatum: string;
  abfahrtName: string;
  abfahrtGleis: string;
  departureTrackLabelAccessibility: string;
  abfahrtKoordination: SBBCoordinates;
  previewType: string;
  duspUrl: string;
  duspPreviewUrl: string;
  duspNativeStyleUrl: string;
  duspNativeDarkStyleUrl: string;
  duspNativeUrl: string;
  walkBezeichnung: string;
  walkBezeichnungAccessibility: string;
  walkIcon: string;
  transportServiceAttributes: unknown[];
  transportHinweis?: string;
  belegungErste: SBBBelegung;
  belegungZweite: SBBBelegung;
  type: string;
  actionUrl: string;
  formationUrl?: string;
  durationProzent?: string;
  duration: string;
  // HH:mm
  ankunftTime: string;
  // dd.MM.yyyy
  ankunftDatum: string;
  ankunftGleis: string;
  arrivalTrackLabelAccessibility: string;
  ankunftKoordinaten: SBBCoordinates;
  realtimeInfo: SBBRealtimeInfo;
  abfahrtPlatformChange: boolean;
  ankunftPlatformChange: boolean;
  abfahrtCancellation: boolean;
  ankunftCancellation: boolean;
}
