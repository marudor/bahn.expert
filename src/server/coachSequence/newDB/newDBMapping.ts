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
import type {
  Platform,
  Sector,
  VehicleCategory,
  VehicleGroupInSequenceDeparture,
  VehicleInGroup,
  VehicleSequenceDeparture,
  VehicleType,
} from '@/external/generated/coachSequence';

function mapSectors(
  sectors: Sector[] | undefined,
  basePercent: number,
): CoachSequenceSector[] {
  return (
    sectors?.map((s) => ({
      name: s.name,
      position: {
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
  if (platform?.start == undefined || platform.end == undefined) {
    return [undefined, 0];
  }
  const basePercent = 100 / (platform.end - platform.start);
  return [
    {
      stopPlace: {
        evaNumber,
        name: '',
      },
      sectors: mapSectors(platform.sectors, basePercent),
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

const diningCategories = new Set<VehicleCategory>([
  'DININGCAR',
  'HALFDININGCAR_ECONOMY_CLASS',
  'HALFDININGCAR_FIRST_CLASS',
]);
function mapFeatures(vehicle: VehicleInGroup): CoachSequenceCoachFeatures {
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
  vehicle: VehicleInGroup,
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

function mapGroup(
  group: VehicleGroupInSequenceDeparture,
  basePercent: number,
): CoachSequenceGroup | undefined {
  const coaches = group.vehicles.map((vehicle) =>
    mapVehicle(vehicle, basePercent),
  );
  if (coaches.includes(undefined)) {
    return undefined;
  }
  return {
    name: group.name,
    destinationName: group.transport.destination.name,
    originName: 'UNKNOWN',
    number: group.transport.number.toString(),
    coaches: coaches as CoachSequenceCoach[],
  };
}

function mapDirection(coaches: CoachSequenceCoach[]) {
  const first = coaches[0];
  const last = coaches.at(-1)!;

  return last.position.startPercent > first.position.startPercent;
}

function mapSequence(
  sequence: VehicleSequenceDeparture,
  basePercent: number,
): CoachSequence | undefined {
  const groups = sequence.groups.map((g) => mapGroup(g, basePercent));
  if (groups.includes(undefined)) return undefined;
  return {
    groups: groups as CoachSequenceGroup[],
  };
}

export const mapInformation = (
  upstreamSequence: VehicleSequenceDeparture | undefined,
  trainCategory: string,
  trainNumber: number,
  evaNumber: string,
): CoachSequenceInformation | undefined => {
  if (!upstreamSequence) {
    return undefined;
  }
  const [stop, basePercent] = mapStop(evaNumber, upstreamSequence.platform);
  if (!stop) {
    return undefined;
  }
  const sequence = mapSequence(upstreamSequence, basePercent);
  if (!sequence) {
    return undefined;
  }
  const allCoaches = sequence.groups.flatMap((g) => g.coaches);

  const information: CoachSequenceInformation = {
    source: 'NEW',
    product: {
      number: trainNumber.toString(),
      type: trainCategory,
      line: getLineFromNumber(trainNumber.toString()),
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
