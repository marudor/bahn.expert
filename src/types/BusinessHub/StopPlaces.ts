import { CommonStation } from 'types/station';

export interface APIResult {
  _embedded: Embedded;
  page: Page;
  _links: Links;
}

interface Embedded {
  stopPlaceList: StopPlace[];
}

export interface StopPlace {
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

export interface BusinessHubCoordinates {
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

interface Address {
  city: string;
  postalCode: string;
  street: string;
  state?: string;
}

interface StationManagement {
  identifier: number;
  name: string;
}

interface LocalTransportAuthority {
  shortName: string;
  name: string;
}

interface RegionalUnit {
  identifier: string;
  shortName: string;
  name: string;
}

interface TimetableOffice {
  name: string;
  email: string;
}

interface Availability {
  day:
    | 'monday'
    | 'tuesday'
    | 'wednesday'
    | 'thursday'
    | 'friday'
    | 'saturday'
    | 'sunday';
  openTime: string;
  closeTime: string;
}

interface DBInformation {
  availability: Availability[];
}
interface LocalServiceStaff {
  availability: Availability[];
}

interface Details {
  ratingCategory: number;
  priceCategory: number;
  hasParking: boolean;
  hasBicycleParking: boolean;
  hasLocalPublicTransport: boolean;
  hasPublicFacilities: boolean;
  hasLockerSystem: boolean;
  hasTravelNecessities: boolean;
  hasSteplessAccess: string;
  mobilityService: string;
  hasWifi: boolean;
  hasTravelCenter: boolean;
  hasRailwayMission: boolean;
  hasDbLounge: boolean;
  hasLostAndFound: boolean;
  hasCardRental: boolean;
  stationManagement: StationManagement;
  localTransportAuthority: LocalTransportAuthority;
  regionalUnit: RegionalUnit;
  timetableOffice: TimetableOffice;
  dbInformation: DBInformation;
  localServiceStaff: LocalServiceStaff;
}

interface TripleSCenter {
  identifier: number;
  name: string;
  publicPhoneNumber: string;
  publicFaxNumber: string;
  internalPhoneNumber: string;
  internalFaxNumber: string;
  address: Address;
}

interface CommonDetailsApiResult {
  alternativeNames: string[];
  identifiers: KnownIdentifier[];
  location: BusinessHubCoordinates;
  address: Address;
  details: Details;
}

export interface DetailsApiResult extends CommonDetailsApiResult {
  name: string;
  _links: Links;
  _embedded?: {
    neighbours: {
      name: string;
      _links: {
        self: Href;
      };
    }[];
    tripleSCenter: TripleSCenter;
  };
}

export interface DetailBusinessHubStation
  extends BusinessHubStation,
    CommonDetailsApiResult {
  tripleSCenter?: TripleSCenter;
}
