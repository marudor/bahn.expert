import {
  getBaureiheByCoaches,
  getBaureiheByUIC,
} from 'server/coachSequence/baureihe';
import { getSeatsForCoach } from 'server/coachSequence/specialSeats';
import TrainNames from './TrainNames';
import type {
  CoachSequenceBaureihe,
  CoachSequenceCoach,
  CoachSequenceGroup,
  CoachSequenceInformation,
  CoachSequenceProduct,
} from 'types/coachSequence';

const hasNonLokCoach = (group: CoachSequenceGroup) =>
  group.coaches.some((c) => c.category !== 'LOK' && c.category !== 'TRIEBKOPF');

export function enrichCoachSequence(
  coachSequence: CoachSequenceInformation,
): void {
  let prevGroup: CoachSequenceGroup | undefined;
  for (const group of coachSequence.sequence.groups) {
    enrichCoachSequenceGroup(group, coachSequence.product);
    if (!hasNonLokCoach(group)) {
      continue;
    }
    if (prevGroup && prevGroup.destinationName !== group.destinationName) {
      coachSequence.multipleDestinations = true;
    }
    if (prevGroup && prevGroup.number !== group.number) {
      coachSequence.multipleTrainNumbers = true;
    }
    prevGroup = group;
  }
}

const allowedBR = new Set(['IC', 'EC', 'ICE', 'ECE']);
const tznRegex = /(\d+)/;
function enrichCoachSequenceGroup(
  group: CoachSequenceGroup,
  product: CoachSequenceProduct,
) {
  // https://inside.bahn.de/entstehung-zugnummern/?dbkanal_006=L01_S01_D088_KTL0006_INSIDE-BAHN-2019_Zugnummern_LZ01
  const trainNumberAsNumber = Number.parseInt(group.number, 10);
  if (trainNumberAsNumber >= 9550 && trainNumberAsNumber <= 9599) {
    for (const c of group.coaches) {
      if (c.features.comfort) {
        c.features.comfort = false;
      }
    }
  }

  if (allowedBR.has(product.type)) {
    let tzn: string | undefined;
    if (group.name.startsWith('IC')) {
      tzn = tznRegex.exec(group.name)?.[0];
      group.trainName = TrainNames(tzn);
    }
    group.baureihe = calculateBR(group.coaches, tzn);
    if (group.baureihe) {
      if (group.baureihe.identifier === '401.LDV') {
        const wagen4 = group.coaches.find(
          (c) => c.identificationNumber === '6',
        );
        if (wagen4) {
          wagen4.features.disabled = false;
        }
      }
      for (const c of group.coaches) {
        c.seats = getSeatsForCoach(c, group.baureihe.identifier);
      }
    }
  }
}

function calculateBR(
  coaches: CoachSequenceCoach[],
  tzn?: string,
): CoachSequenceBaureihe | undefined {
  for (const c of coaches) {
    if (!c.uic) continue;
    const br = getBaureiheByUIC(c.uic, coaches, tzn);
    if (br) return br;
  }

  return getBaureiheByCoaches(coaches);
}
