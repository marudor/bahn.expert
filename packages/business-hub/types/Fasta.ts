export interface FastaResponse {
  facilieites: Facilities[];
  name: string;
  stationnumber: number;
}

export interface Facilities {
  description: string;
  equipmentnumber: number;
  geocoordX: number;
  geocoordY: number;
  state: string;
  stateExplanation: string;
  type: string;
}
