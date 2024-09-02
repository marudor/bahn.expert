import type { AuslastungsValue } from '@/types/routing';
import type { MinimalStopPlace } from '@/types/stopPlace';

export interface CoachSequencePosition {
	// if not set we default to the center
	cubePosition?: number;
	startPercent: number;
	endPercent: number;
}

export interface CoachSequenceSector {
	name: string;
	position: CoachSequencePosition;
}

export interface CoachSequenceStop {
	stopPlace: MinimalStopPlace;
	sectors: CoachSequenceSector[];
}

export interface CoachSequenceProduct {
	number: string;
	type: string;
	line?: string;
}

export interface CoachSequenceCoachSeats {
	comfort?: string;
	disabled?: string;
	family?: string;
}

export interface CoachSequenceCoachFeatures {
	dining?: boolean;
	wheelchair?: boolean;
	bike?: boolean;
	disabled?: boolean;
	quiet?: boolean;
	info?: boolean;
	family?: boolean;
	toddler?: boolean;
	wifi?: boolean;
	comfort?: boolean;
	airConditioning?: boolean;
	boardingAid?: boolean;
	toilet?: boolean;
	toiletWheelchair?: boolean;
	multiPurpose?: boolean;
}

export interface CoachSequenceCoach {
	/**
	 * 0: Unknown; 1: erste; 2: zweite; 3: 1&2; 4: Not for passengers
	 */
	class: 0 | 1 | 2 | 3 | 4;
	vehicleCategory: string;
	closed?: boolean;
	/**
	 * only filled for real time information
	 */
	uic?: string;
	type?: string;
	/**
	 * Wagenordnungsnummer
	 */
	identificationNumber?: string;
	position: CoachSequencePosition;
	features: CoachSequenceCoachFeatures;
	seats?: CoachSequenceCoachSeats;
	occupancy?: AuslastungsValue;
}

export const AvailableBRConstant = [
	'401',
	'402',
	'403',
	'406',
	'407',
	'408',
	'410.1',
	'411',
	'412',
	'415',
	'4110',
	'4010',
] as const;
export type AvailableBR = (typeof AvailableBRConstant)[number];

export const AvailableIdentifierConstant = [
	'401.LDV',
	'401.9',
	'411.S1',
	'411.S2',
	'412.7',
	'412.13',
	'403.R',
	'403.S1',
	'403.S2',
	'406.R',
	'IC2.TRE',
	'MET',
	'TGV',
] as const;
export type AvailableIdentifierOnly =
	(typeof AvailableIdentifierConstant)[number];
export type AvailableIdentifier = AvailableIdentifierOnly | AvailableBR;

export interface CoachSequenceBaureihe {
	name: string;
	baureihe?: AvailableBR;
	identifier: AvailableIdentifier;
}

export interface CoachSequenceGroup {
	coaches: CoachSequenceCoach[];
	name: string;
	originName: string;
	destinationName: string;
	trainName?: string;
	number: string;
	baureihe?: CoachSequenceBaureihe;
}

export interface CoachSequence {
	groups: CoachSequenceGroup[];
}

export interface CoachSequenceInformation {
	source:
		| 'OEBB'
		| 'DB-noncd'
		| 'DB-plan'
		| 'DB-bahnde'
		| 'SBB'
		| 'DB-risTransports';
	stop: CoachSequenceStop;
	product: CoachSequenceProduct;
	sequence: CoachSequence;

	multipleTrainNumbers?: boolean;
	multipleDestinations?: boolean;
	isRealtime: boolean;
	/**
	 * true = in direction of first sector in array
	 * false = in direction of last sector in array
	 * undefined = we do not know
	 */
	direction?: boolean;

	// only for DB stuff
	journeyId?: string;
}
