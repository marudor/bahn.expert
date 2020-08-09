declare module 'db-stations/data.json' {
  export interface OpenDataStation {
    type: 'station';
    id: string;
    ril100: string;
    nr: number;
    name: string;
    weight: number;
    location: {
      type: 'location';
      latitude: number;
      longitude: number;
    };
    operator: {
      type: 'operator';
      id: string;
      name: string;
    };
    address: {
      city: string;
      zipcode: string;
      street: string;
    };
  }

  declare const stations: OpenDataStation[];
  export default stations;
}
