/**
 * 0: Default; 1: Favendo; 2: DBNavigator; 3: OpenData; 4: OpenDataOffline; 5: Broken; 6: HAFAS; 7: Broken; 8: StationsData; 9: Broken
 */
export type AllowedStationAPIs = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export interface Coordinates {
  lat: number;
  lng: number;
}
export interface IrisStation {
  name: string;
  meta: string[];
  eva: string;
  ds100: string;
  db: string;
  creationts: string;
  p: string;
}
export interface IrisStationWithRelated {
  station: IrisStation;
  relatedStations: IrisStation[];
}
export declare namespace Lat {
  export type Lat = number;
}
export declare namespace Lng {
  export type Lng = number;
}
export interface Station {
  title: string;
  id: string;
  favendoId?: number;
  DS100?: string;
}
export type Stations = Station[];
