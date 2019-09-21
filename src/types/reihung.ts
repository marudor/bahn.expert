import { Formation } from 'types/api/reihung';

export type Meta = {
  id: string;
  owner: 'vz';
  format: 'JSON';
  version: string;
  created: string;
  sequence: number;
};

export type Data = {
  istformation: Formation;
};

export type Wagenreihung = {
  meta: Meta;
  data: Data;
};

export type Reihung = Formation;
