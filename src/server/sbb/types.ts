export interface SBBCoachSequenceInformation {
  data: {
    trainFormation: {
      originFormation: SBBCoachSequence;
      destinationFormation: SBBCoachSequence;
      legendItems: SBBCoachSequenceLegend[];
    };
  };
}

export interface SBBCoachSequenceCoach {
  type: string;
  number: string;
  carUic: string;
  class: 'FIRST' | 'SECOND';
  occupancy: 'UNKNOWN' | 'LOW' | 'MEDIUM' | 'HIGH';
  // referene to SBBCoachSequenceLegend
  attributes: string[];
  closed: boolean;
  previousPassage: boolean;
  nextPassage: boolean;
}

interface SBBCoachSequenceSection {
  name: string;
  cars: SBBCoachSequenceCoach[];
}

interface SBBCoachSequenceGroup {
  destination?: any;
  sections: SBBCoachSequenceSection[];
}

interface SBBCoachSequence {
  trainGroups: SBBCoachSequenceGroup[];
  leavingDirection: 'LEFT' | 'RIGHT';
  stationName: string;
}

interface SBBCoachSequenceLegend {
  id: string;
  text: string;
  icon: string;
}

interface SBBTripProduct {
  name: string;
  line: string;
  number: string;
  vehicleMode: 'TRAIN' | Omit<string, 'TRAIN'>;
  vehicleSubModeShortName: string;
  corporateIdentityIcon: string;
}

interface SBBStopPlace {
  id: string;
  name: string;
}

interface SBBOccupancy {
  firstClass: 'LOW' | 'MEDIUM' | 'HIGH';
  secondClass: 'LOW' | 'MEDIUM' | 'HIGH';
}

interface SBBTripSummary {
  duration: number;
  arrival: unknown;
  arrivalWalk: number;
  lastStopPlace: SBBStopPlace;
  tripStatus: unknown;
  departure: unknown;
  departureWalk: number;
  firstStopPlace: SBBStopPlace;
  product: SBBTripProduct;
  direction: string;
  occupancy: SBBOccupancy;
  boardingAlightingAccessibility: string;
  international: boolean;
}

interface SBBStopPoint {
  place: SBBStopPlace;
  occupancy: SBBOccupancy;
  accessibilityBoardingAlighting: unknown;
  stopStatus: string;
  stopStatusFormatted: string | null;
}

interface SBBTripJourney {
  id: string;
  stopPoints: SBBStopPoint;
  serviceProducts: SBBTripProduct[];
  direction: string;
  serviceAlteration: unknown;
  situations: unknown[];
  notices: unknown[];
  quayTypeName: string;
  quayTypeShortName: string;
}

interface SBBTripLeg {
  duration: number;
  id: string;
  start: SBBStopPlace;
  end: SBBStopPlace;
  arrival: unknown;
  departure: unknown;
  serviceJourney: SBBTripJourney;
}

export interface SBBTrip {
  id: string;
  legs: SBBTripLeg[];
  situations: unknown[];
  notices: unknown[];
  valid: boolean;
  summary: SBBTripSummary;
  searchHint: null;
}

export interface SBBCoachSequenceWithTrip {
  sequence: SBBCoachSequenceInformation;
  trip: SBBTrip;
}
