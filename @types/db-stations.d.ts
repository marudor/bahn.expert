declare module 'db-stations/data.json' {
  export type OpenDataStation = {
    type: 'station';
    id: string;
    ds100: string;
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
  };

  declare const stations: OpenDataStation[];
  export default stations;
}
