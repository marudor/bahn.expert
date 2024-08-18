import type {
	Platform,
	Sector,
	VehicleGroupInSequenceDeparture,
	VehicleInGroupDeparture,
	VehicleSequenceDeparture,
	VehicleType,
} from '@/external/generated/risTransports';
import { getJourneyDetails } from '@/external/risJourneysV2';
import { enrichCoachSequence } from '@/server/coachSequence/commonMapping';
import { getLineFromNumber } from '@/server/journeys/lineNumberMapping';
import { logger } from '@/server/logger';
import type {
	CoachSequence,
	CoachSequenceCoach,
	CoachSequenceCoachFeatures,
	CoachSequenceGroup,
	CoachSequenceInformation,
	CoachSequenceSector,
	CoachSequenceStop,
} from '@/types/coachSequence';

function mapSectors(
	sectors: Sector[] | undefined,
	basePercent: number,
): CoachSequenceSector[] {
	return (
		sectors?.map((s) => ({
			name: s.name,
			position: {
				cubePosition: s.cubePosition ? basePercent * s.cubePosition : undefined,
				startPercent: basePercent * s.start,
				endPercent: basePercent * s.end,
			},
		})) || []
	);
}

function mapStop(
	evaNumber: string,
	platform?: Platform,
): [CoachSequenceStop | undefined, number] {
	if (
		platform?.details?.start === undefined ||
		platform.details?.end === undefined
	) {
		return [undefined, 0];
	}
	const basePercent = 100 / (platform.details.end - platform.details.start);
	return [
		{
			stopPlace: {
				evaNumber,
				name: '',
			},
			sectors: mapSectors(platform.details.sectors, basePercent),
		},
		basePercent,
	];
}

function mapClass(vehicleType: VehicleType): CoachSequenceCoach['class'] {
	switch (vehicleType.category) {
		case 'LOCOMOTIVE':
		case 'POWERCAR': {
			return 4;
		}
		case 'DININGCAR': {
			return 2;
		}
	}
	if (vehicleType.hasFirstClass && vehicleType.hasEconomyClass) {
		return 3;
	}
	if (vehicleType.hasFirstClass) {
		return 1;
	}
	if (vehicleType.hasEconomyClass) {
		return 2;
	}
	return 0;
}

const diningCategories = new Set<string>([
	'DININGCAR',
	'HALFDININGCAR_ECONOMY_CLASS',
	'HALFDININGCAR_FIRST_CLASS',
]);
function mapFeatures(
	vehicle: VehicleInGroupDeparture,
): CoachSequenceCoachFeatures {
	const features: CoachSequenceCoachFeatures = {};

	for (const a of vehicle.amenities) {
		switch (a.type) {
			case 'BIKE_SPACE': {
				features.bike = true;
				break;
			}
			case 'BISTRO': {
				features.dining = true;
				break;
			}
			case 'INFO': {
				features.info = true;
				break;
			}
			case 'SEATS_BAHN_COMFORT': {
				features.comfort = true;
				break;
			}
			case 'SEATS_SEVERELY_DISABLED': {
				features.disabled = true;
				break;
			}
			case 'WHEELCHAIR_SPACE': {
				features.wheelchair = true;
				break;
			}
			case 'WIFI': {
				features.wifi = true;
				break;
			}
			case 'ZONE_FAMILY': {
				features.family = true;
				break;
			}
			case 'ZONE_QUIET': {
				features.quiet = true;
				break;
			}
			case 'CABIN_INFANT': {
				features.toddler = true;
				break;
			}
		}
	}

	if (!features.dining && diningCategories.has(vehicle.type.category)) {
		features.dining = true;
		logger.debug('Manually set dining feature');
	}
	return features;
}

function mapVehicle(
	vehicle: VehicleInGroupDeparture,
	basePercent: number,
): CoachSequenceCoach | undefined {
	if (!vehicle.platformPosition) {
		return undefined;
	}
	return {
		identificationNumber: vehicle.wagonIdentificationNumber?.toString(),
		uic: vehicle.vehicleID,
		type: vehicle.type.constructionType,
		class: mapClass(vehicle.type),
		vehicleCategory: vehicle.type.category,
		closed:
			vehicle.status === 'CLOSED' ||
			vehicle.type.category === 'LOCOMOTIVE' ||
			vehicle.type.category === 'POWERCAR',
		position: {
			startPercent: basePercent * vehicle.platformPosition.start,
			endPercent: basePercent * vehicle.platformPosition.end,
		},
		features: mapFeatures(vehicle),
	};
}

async function mapGroup(
	group: VehicleGroupInSequenceDeparture,
	basePercent: number,
): Promise<CoachSequenceGroup | undefined> {
	const coaches = group.vehicles.map((vehicle) =>
		mapVehicle(vehicle, basePercent),
	);
	const journey = await getJourneyDetails(group.journeyID);
	if (coaches.includes(undefined)) {
		return undefined;
	}
	return {
		name: group.name,
		destinationName: group.destination.name,
		originName: 'UNKNOWN',
		number: journey?.info.headerJourneyNumber?.toString() || 'Unbekannt',
		coaches: coaches as CoachSequenceCoach[],
	};
}

function mapDirection(coaches: CoachSequenceCoach[]) {
	const first = coaches[0];
	const last = coaches.at(-1)!;

	return last.position.startPercent > first.position.startPercent;
}

async function mapSequence(
	sequence: VehicleSequenceDeparture,
	basePercent: number,
): Promise<CoachSequence | undefined> {
	const groups = await Promise.all(
		sequence.groups.map((g) => mapGroup(g, basePercent)),
	);
	if (groups.includes(undefined)) return undefined;
	return {
		groups: groups as CoachSequenceGroup[],
	};
}

export const mapInformation = async (
	upstreamSequence: VehicleSequenceDeparture | undefined,
	trainCategory: string,
	trainNumber: string,
	evaNumber: string,
): Promise<CoachSequenceInformation | undefined> => {
	if (!upstreamSequence) {
		return undefined;
	}
	const [stop, basePercent] = mapStop(evaNumber, upstreamSequence.platform);
	if (!stop) {
		return undefined;
	}
	const sequence = await mapSequence(upstreamSequence, basePercent);
	if (!sequence) {
		return undefined;
	}
	const allCoaches = sequence.groups.flatMap((g) => g.coaches);

	const information: CoachSequenceInformation = {
		source: 'DB-risTransports',
		product: {
			number: trainNumber,
			type: trainCategory,
			line: getLineFromNumber(trainNumber),
		},
		isRealtime: allCoaches.every(
			(c) => c.uic || c.vehicleCategory === 'LOCOMOTIVE',
		),
		stop,
		sequence,
		direction: mapDirection(allCoaches),
	};
	enrichCoachSequence(information);

	return information;
};
