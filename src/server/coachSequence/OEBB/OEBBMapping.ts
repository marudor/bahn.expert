import { enrichCoachSequence } from 'server/coachSequence/commonMapping';
import type {
  CoachSequenceCoach,
  CoachSequenceCoachFeatures,
  CoachSequenceGroup,
  CoachSequenceInformation,
  CoachSequencePosition,
  CoachSequenceProduct,
  CoachSequenceSector,
  CoachSequenceStop,
} from 'types/coachSequence';
import type {
  OEBBCoachSequenceWagon,
  OEBBInfo,
  OEBBPlatformInfo,
  OEBBTimeTableInfo,
} from 'oebb/types/coachSequence';

function mapClass(wagon: OEBBCoachSequenceWagon): CoachSequenceCoach['class'] {
  if (wagon.kind === 'TFZ') return 4;
  // TODO: Is business really first class?
  if (
    (wagon.capacityFirstClass || wagon.capacityBusinessClass) &&
    wagon.capacitySecondClass
  )
    return 3;
  if (wagon.capacitySecondClass || wagon.isDining) return 2;
  // TODO: Is business really first class?
  if (wagon.capacityFirstClass || wagon.capacityBusinessClass) return 1;
  // TODO: mark this as liegeplätze?
  if (wagon.capacityCouchette) return 2;
  // TODO: mark this as schlafplätze?
  if (wagon.capacitySleeper) return 1;
  if (!wagon.ranking) return 4;
  return 0;
}

const mapFeatures = (
  wagon: OEBBCoachSequenceWagon,
): CoachSequenceCoachFeatures => ({
  bike: wagon.isBicycleAllowed,
  dining: wagon.isDining,
  info: wagon.isInfoPoint,
  wheelchair: wagon.capacityWheelChair > 0,
  quiet: wagon.isQuietZone,
  family: wagon.isChildCinema || wagon.isPlayZone,
  wifi: wagon.hasWifi,
});

const mapGroups = (info: OEBBInfo): CoachSequenceGroup[] => {
  if (!info.train) return [];
  let currentWagons: OEBBCoachSequenceWagon[] = [];
  const wagonsForGroups: OEBBCoachSequenceWagon[][] = [];
  let oldDestination: string | undefined = undefined;
  for (const w of info.train.wagons) {
    if (oldDestination && oldDestination !== w.destination) {
      wagonsForGroups.push(currentWagons);
      currentWagons = [];
    }
    currentWagons.push(w);
    oldDestination = w.destination;
  }
  wagonsForGroups.push(currentWagons);

  let startOffset = info.trainOnPlatform?.position || 0;
  const maxMeter =
    info.platform?.length ||
    info.train.wagons.reduce((sum, w) => sum + w.lengthOverBuffers, 0);

  return wagonsForGroups.map((wagons) => {
    const coaches: CoachSequenceCoach[] = [];
    const positions: CoachSequencePosition[] = [];

    for (const w of wagons) {
      const endMeter = startOffset + w.lengthOverBuffers;
      const startPercent = (startOffset / maxMeter) * 100;
      const endPercent = (endMeter / maxMeter) * 100;
      const position: CoachSequencePosition = {
        endPercent,
        startPercent,
      };
      positions.push(position);
      startOffset = endMeter;
    }

    for (const [i, w] of wagons.entries()) {
      coaches.push({
        class: mapClass(w),
        features: mapFeatures(w),
        identificationNumber: w.ranking ? String(w.ranking) : '',
        category: '',
        vehicleCategory: 'UNDEFINED',
        closed: w.isLocked || w.kind === 'TFZ',
        position: positions[i],
        uic: w.uicNumber,
        type: w.kind,
      });
    }
    let trainNumber = '';
    const destinationDB640 = wagons[0].destination;
    const train = info.train;
    if (train && train.stations) {
      if (train.wagons.length === wagons.length) {
        trainNumber = info.timeTableInfo.trainNr.toString();
      } else {
        const stationsForTrain = train.stations;
        if (
          stationsForTrain[stationsForTrain.length - 1] === destinationDB640
        ) {
          trainNumber = train.trainNr.toString();
        } else if (info.timeTableInfo.portions.length <= 2) {
          trainNumber =
            info.timeTableInfo.portions
              .find((p) => p.trainNr !== train.trainNr)
              ?.trainNr.toString() || '';
        }
      }
    }

    return {
      coaches,
      destinationName: wagons[0].destinationName,
      originName: wagons[0].origin,
      number: trainNumber,
      name: '',
    };
  });
};

const mapProduct = (
  timeTableInfo: OEBBTimeTableInfo,
): CoachSequenceProduct => ({
  number: String(timeTableInfo.trainNr),
  type: timeTableInfo.trainName
    .replace(timeTableInfo.trainNr.toString(), '')
    .trim(),
});

const mapSectors = (platformInfo?: OEBBPlatformInfo): CoachSequenceSector[] => {
  if (!platformInfo) return [];
  const sectors: CoachSequenceSector[] = [];
  let startMeter = 0;
  const maxMeter = platformInfo.length;

  for (const s of platformInfo.sectors) {
    sectors.push({
      name: s.name,
      position: {
        startPercent: (startMeter / maxMeter) * 100,
        endPercent: (startMeter + s.length) / maxMeter,
      },
    });
    startMeter += s.length;
  }
  return sectors;
};

const mapStop = (info: OEBBInfo): CoachSequenceStop => ({
  stopPlace: {
    evaNumber: '',
    name: info.timeTableInfo.stationName,
  },
  sectors: mapSectors(info.platform),
});

export const mapInformation = (
  info?: OEBBInfo,
): CoachSequenceInformation | undefined => {
  if (!info || !info.train) return;
  if (info.train.wagons.some((w) => !w.lengthOverBuffers)) return;

  const groups = mapGroups(info);

  const groupsRelevantForDifferentDestination = groups.filter((g) =>
    g.coaches.some((c) => !c.closed),
  );

  const coachsequenceInfo: CoachSequenceInformation = {
    source: 'OEBB',
    isRealtime: info.train?.isReported ?? false,
    product: mapProduct(info.timeTableInfo),
    direction: info.trainOnPlatform
      ? !info.trainOnPlatform.departureTowardsFirstSector
      : undefined,
    stop: mapStop(info),
    sequence: {
      groups,
    },
    multipleDestinations: groupsRelevantForDifferentDestination.length > 1,
    multipleTrainNumbers: info.timeTableInfo.portions.length > 1,
  };

  enrichCoachSequence(coachsequenceInfo);

  return coachsequenceInfo;
};
