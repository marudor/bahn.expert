import { CommonStation } from 'types/station';

export interface APIResult {
  _embedded: Embedded;
  page: Page;
  _links: Links;
}

interface Embedded {
  stopPlaceList: StopPlace[];
}

interface StopPlace {
  name: string;
  identifiers: KnownIdentifier[];
  location: BusinessHubCoordinates;
  _links: {
    self: Href;
  };
}

type KnownIdentifier =
  | Identifier<'EVA'>
  | Identifier<'RIL100'>
  | Identifier<'STADA'>;

interface Identifier<type extends string> {
  type: type;
  value: string;
}

interface BusinessHubCoordinates {
  latitude: number;
  longitude: number;
}

interface Page {
  size: number;
  totalElements: number;
  totalPages: number;
  number: number;
}

interface Links {
  self: Href;
  next: Href;
}

interface Href {
  href: string;
}

export interface BusinessHubStation extends CommonStation {
  ds100?: string;
  stada?: string;
  location: BusinessHubCoordinates;
}
