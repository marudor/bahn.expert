import type {
	AvailableIdentifier,
	CoachSequenceCoach,
	CoachSequenceCoachSeats,
} from '@/types/coachSequence';

export function getComfortSeats(
	identifier: AvailableIdentifier | undefined,
	klasse: CoachSequenceCoach['class'],
): string | undefined {
	switch (identifier) {
		case '401': {
			return klasse === 1 ? '11-36' : '11-57';
		}
		case '401.9':
		case '401.LDV': {
			return klasse === 1 ? '12, 14, 16, 21-26, 31' : '11-44';
		}
		case '402': {
			return klasse === 1 ? '11-16, 21, 22' : '81-108';
		}
		case '403':
		case '403.S1':
		case '403.S2':
		case '406': {
			return klasse === 1 ? '12-26' : '11-38';
		}
		case '403.R':
		case '406.R': {
			return klasse === 1 ? '12-26' : '11-37';
		}
		case '407': {
			return klasse === 1 ? '21-26, 31, 33, 35' : '31-55, 57';
		}
		case '408': {
			return klasse === 1 ? '61-76' : '11-44';
		}
		case '411.S1':
		case '411.S2':
		case '411': {
			return klasse === 1 ? '46, 52-56' : '92, 94, 96, 98, 101-118';
		}
		case '412.7': {
			return klasse === 1 ? '41, 44-53' : '11-44';
		}
		case '412':
		case '412.13': {
			return klasse === 1 ? '11-46' : '11-68';
		}
		case '415': {
			return klasse === 1 ? '52, 54, 56' : '81-88, 91-98';
		}
		case 'MET': {
			return klasse === 1 ? '61-66' : '91-106';
		}
		case 'IC2.TRE': {
			return klasse === 1 ? '73, 75, 83-86' : '31-38, 41-45, 47';
		}
		case '4110': {
			return klasse === 3 ? '134, 138' : '135-144';
		}
		case '4010': {
			return klasse === 1 ? '141, 142, 145, 146' : '111-138';
		}
	}
}

export function getDisabledSeats(
	identifier: AvailableIdentifier | undefined,
	klasse: CoachSequenceCoach['class'],
	wagenordnungsnummer: string | undefined,
): string | undefined {
	switch (identifier) {
		case '401': {
			return klasse === 1 ? '51, 52, 53, 55' : '111-116';
		}
		case '401.9':
		case '401.LDV': {
			if (klasse === 1) {
				return '11, 13, 15';
			}
			return wagenordnungsnummer === '6' ? '53, 54' : '11-15, 17';
		}
		case '402': {
			return klasse === 1 ? '12, 21' : '81, 85-88';
		}
		case '403':
		case '403.R':
		case '403.S1':
		case '403.S2':
		case '406':
		case '406.R': {
			if (klasse === 1) return '64, 66';
			if (wagenordnungsnummer === '25' || wagenordnungsnummer === '35') {
				// redesign slighlty different
				return ['403R', '403.S1R', '403.S2R'].includes(identifier)
					? '61, 63, 65-67'
					: '61, 63, 65, 67';
			}

			return '106, 108';
		}
		case '407': {
			if (klasse === 1) return '13, 15';
			if (wagenordnungsnummer === '11' || wagenordnungsnummer === '21') {
				return '11-18';
			}
			return '28, 33-34';
		}
		case '408': {
			if (klasse === 1) return '22, 23';
			if (wagenordnungsnummer === '24') {
				return '13-16';
			}
			return '11-14';
		}
		case '411.S1':
		case '411.S2':
		case '411': {
			return klasse === 1 ? '21, 22' : '15-18';
		}
		case '412.7': {
			return klasse === 1 ? '12, 13' : '11-18';
		}
		case '412':
		case '412.13': {
			if (klasse === 1)
				return wagenordnungsnummer === '10' ? '12, 13' : '11, 14, 21';

			switch (wagenordnungsnummer) {
				case '1': {
					return '11-24';
				}
				case '8': {
					return '11, 12';
				}
				case '9': {
					return '41, 45, 46';
				}
			}
			break;
		}
		case '415': {
			return klasse === 1 ? '21' : '15, 17';
		}
		case 'MET': {
			return klasse === 1 ? '16, 21' : '12, 14, 16';
		}
		case 'IC2.TRE': {
			return klasse === 1 ? '21, 71' : '25, 101-105, 171-173';
		}
		case '4110': {
			return klasse === 3 ? '148' : '21-26';
		}
		case '4010': {
			return klasse === 1 ? '46, 51' : '21-32';
		}
	}
}

export function getFamilySeats(
	identifier: AvailableIdentifier | undefined,
): string | undefined {
	switch (identifier) {
		case '401': {
			return '81-116';
		}
		case '401.9':
		case '401.LDV': {
			return '91-116';
		}
		case '402': {
			return '61-78';
		}
		case '403':
		case '403.R':
		case '403.S1':
		case '403.S2':
		case '406':
		case '406.R': {
			return '11-28';
		}
		case '407': {
			return '11-28';
		}
		case '408': {
			return '61-78';
		}
		case '411.S1':
		case '411.S2':
		case '411': {
			return '11-18, 31-38';
		}
		case '412.7': {
			return '61-78';
		}
		case '412':
		case '412.13': {
			return '61-78';
		}
		case '415': {
			return '21-28';
		}
		case 'MET': {
			return '11-26';
		}
		case 'IC2.TRE': {
			return '121, 123, 131-138';
		}
		case '4110':
		case '4010': {
			return '21-38';
		}
	}
}

export function getSeatsForCoach(
	coach: CoachSequenceCoach,
	identifier: AvailableIdentifier,
): CoachSequenceCoachSeats | undefined {
	const family = coach.features.family ? getFamilySeats(identifier) : undefined;
	const disabled = coach.features.disabled
		? getDisabledSeats(identifier, coach.class, coach.identificationNumber)
		: undefined;
	const comfort = coach.features.comfort
		? getComfortSeats(identifier, coach.class)
		: undefined;
	if (family || disabled || comfort) {
		return {
			comfort,
			disabled,
			family,
		};
	}
}
