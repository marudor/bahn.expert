export enum LimitationEnum {
  true = 'true',
  false = 'false',
  unknown = 'unknown',
  notApplicable = 'not applicable',
}

export interface QuayAccessibilityLimitation {
  audibleSignalsAvailable: LimitationEnum;
  automaticDoor: LimitationEnum;
  boardingAid: LimitationEnum;
  passengerInformationDisplay: LimitationEnum;
  platformHeight: LimitationEnum;
  platformSign: LimitationEnum;
  stairsMarking: LimitationEnum;
  stepFreeAccess: LimitationEnum;
  tactileGuidingStrips: LimitationEnum;
  tactileHandrailLabel: LimitationEnum;
  tactilePlatformAccess: LimitationEnum;
}

export interface QuayAccessibilityAssessment {
  accessibilityLimitation: QuayAccessibilityLimitation;
}

export interface Quay {
  id: string;
  name: string;
  accessibilityAssessment: QuayAccessibilityAssessment;
  quayType: string;
}
