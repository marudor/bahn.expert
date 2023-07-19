import { enrichCoachSequence } from '@/server/coachSequence/commonMapping';
import { mapSBBOccupancy } from '@/server/sbb/occupancy';
import type {
  CoachSequenceCoach,
  CoachSequenceInformation,
  CoachSequenceSector,
} from '@/types/coachSequence';
import type {
  SBBCoachSequenceCoach,
  SBBCoachSequenceWithTrip,
} from '@/server/sbb/types';

function mapSectors(sectorNames: string[]): CoachSequenceSector[] {
  const sectors: CoachSequenceSector[] = [];
  const sectorCount = sectorNames.length;
  const sectorLength = 100 / sectorCount;
  for (let i = 0; i < sectorCount; i++) {
    sectors.push({
      name: sectorNames[i],
      position: {
        startPercent: i * sectorLength,
        endPercent: (i + 1) * sectorLength,
      },
    });
  }
  return sectors;
}

function mapClass(
  carClass: SBBCoachSequenceCoach['class'],
): CoachSequenceCoach['class'] {
  switch (carClass) {
    case 'FIRST': {
      return 1;
    }
    case 'SECOND': {
      return 2;
    }
    default: {
      return 4;
    }
  }
}

function mapCar(
  car: SBBCoachSequenceCoach,
): Omit<CoachSequenceCoach, 'position'> {
  return {
    class: mapClass(car.class),
    features: {
      wheelchair: car.attributes.includes('RS'),
      bike: car.attributes.includes('VR') || car.attributes.includes('VO'),
      family: car.attributes.includes('FA'),
    },
    vehicleCategory: 'UNDEFINED',
    identificationNumber: car.number,
    occupancy: mapSBBOccupancy(car.occupancy),
    closed: car.closed,
    uic: car.carUic,
  };
}

export function mapSBBCoachSequence(
  rawSequence?: SBBCoachSequenceWithTrip,
): CoachSequenceInformation | undefined {
  if (!rawSequence) {
    return undefined;
  }

  const sequence = rawSequence.sequence.data.trainFormation.originFormation;
  const tripProduct = rawSequence.trip.summary.product;
  const firstLeg = rawSequence.trip.legs[0];

  const coachSequenceInfo: CoachSequenceInformation = {
    isRealtime: true,
    product: {
      number: tripProduct.number,
      type: tripProduct.vehicleSubModeShortName,
      line: tripProduct.line,
    },
    source: 'SBB',
    stop: {
      stopPlace: {
        name: firstLeg.end.name,
        evaNumber: firstLeg.end.id,
      },
      sectors: mapSectors([
        ...new Set(
          sequence.trainGroups.flatMap((tg) => tg.sections.map((s) => s.name)),
        ),
      ]),
    },
    direction: sequence.leavingDirection === 'LEFT',
    sequence: {
      // @ts-expect-error position is not yet filled
      groups: sequence.trainGroups.map((group, i) => ({
        coaches: group.sections.flatMap((s) =>
          s.cars.map((car) => mapCar(car)),
        ),
        destinationName: group.destination,
        name: `SBB-${i}`,
        number: tripProduct.number,
        originName: firstLeg.start.name,
      })),
    },
  };

  const allCoaches = coachSequenceInfo.sequence.groups.flatMap(
    (tg) => tg.coaches,
  );
  const coachLength = 100 / allCoaches.length;
  for (const [i, allCoach] of allCoaches.entries()) {
    allCoach.position = {
      startPercent: i * coachLength,
      endPercent: (i + 1) * coachLength,
    };
  }

  enrichCoachSequence(coachSequenceInfo);

  return coachSequenceInfo;
}
