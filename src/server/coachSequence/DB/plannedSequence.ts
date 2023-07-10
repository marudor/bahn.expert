import { checkSecrets } from '@/server/checkSecret';
import { getSeatsForCoach } from '@/server/coachSequence/specialSeats';
import { nameMap } from '@/server/coachSequence/baureihe';
import Axios from 'axios';
import type {
  CoachSequenceBaureihe,
  CoachSequenceGroup,
  CoachSequenceInformation,
} from '@/types/coachSequence';

const apiUrl = process.env.PRIVATE_API_URL;
const apiKey = process.env.PRIVATE_API_KEY;

checkSecrets(apiUrl, apiKey);

export const planSequenceAxios = Axios.create({
  baseURL: `${apiUrl}/plannedSequence/v1`,
  headers: {
    'x-api-key': apiKey || '',
  },
});

export async function getPlannedSequence(
  trainNumber: number,
  initialDeparture: Date,
  evaNumber: string,
): Promise<CoachSequenceInformation | undefined> {
  if (!apiKey || !apiUrl) {
    return undefined;
  }
  try {
    const plannedSequence = (
      await planSequenceAxios.get<CoachSequenceInformation>(
        `/sequence/${trainNumber}/${initialDeparture.toISOString()}/${evaNumber}`,
      )
    ).data;

    for (const g of plannedSequence.sequence.groups) {
      const br = getBRFromGroup(g);
      g.baureihe = br;
      g.name = `${g.number}-planned`;
      if (br) {
        for (const coach of g.coaches) {
          coach.seats = getSeatsForCoach(coach, br.identifier);
        }
      }
    }
    return {
      ...plannedSequence,
      source: 'DB-plan',
    };
  } catch {
    return undefined;
  }
}

function getBRWithoutNameFromGroup(
  group: Pick<CoachSequenceGroup, 'coaches' | 'name'>,
): Omit<CoachSequenceBaureihe, 'name'> | undefined {
  const groupName = group.name;
  // ICE
  if (groupName.startsWith('401_11')) {
    return {
      identifier: '401.9',
      baureihe: '401',
    };
  }
  if (groupName.startsWith('401_14')) {
    return {
      identifier: '401',
      baureihe: '401',
    };
  }
  if (groupName.startsWith('402')) {
    return {
      identifier: '402',
      baureihe: '402',
    };
  }
  if (groupName.startsWith('403E')) {
    return {
      identifier: '403.R',
      baureihe: '403',
    };
  }
  if (groupName.startsWith('406')) {
    return {
      identifier: '406',
    };
  }
  if (groupName.startsWith('403')) {
    return {
      identifier: '403',
      baureihe: '403',
    };
  }
  if (groupName.startsWith('406.01')) {
    return {
      identifier: '406',
      baureihe: '406',
    };
  }
  if (groupName.startsWith('406.02')) {
    return {
      identifier: '406.R',
      baureihe: '406',
    };
  }
  if (groupName.startsWith('408.')) {
    return {
      identifier: '408',
      baureihe: '408',
    };
  }
  if (groupName.startsWith('412_12')) {
    return {
      identifier: '412',
      baureihe: '412',
    };
  }
  if (groupName.startsWith('407')) {
    return {
      identifier: '407',
      baureihe: '407',
    };
  }
  if (groupName.startsWith('411')) {
    return {
      identifier: '411',
      baureihe: '411',
    };
  }
  if (groupName.startsWith('412_13')) {
    return {
      identifier: '412.13',
      baureihe: '412',
    };
  }
  if (groupName.startsWith('412_07')) {
    return {
      identifier: '412.7',
      baureihe: '412',
    };
  }
  if (groupName.startsWith('406')) {
    return {
      identifier: '406',
      baureihe: '406',
    };
  }
  if (groupName.startsWith('415')) {
    return {
      identifier: '415',
      baureihe: '415',
    };
  }

  // IC
  if (groupName.startsWith('KISS_06')) {
    return {
      identifier: '4010',
      baureihe: '4010',
    };
  }
  if (groupName.startsWith('KISS_04')) {
    return {
      identifier: '4110',
      baureihe: '4110',
    };
  }
  if (groupName.startsWith('Dosto')) {
    return {
      identifier: 'IC2.TRE',
    };
  }
}

export function getBRFromGroup(
  group: Pick<CoachSequenceGroup, 'coaches' | 'name'>,
): CoachSequenceBaureihe | undefined {
  const brWithoutName = getBRWithoutNameFromGroup(group);
  if (brWithoutName) {
    return {
      ...brWithoutName,
      name: nameMap[brWithoutName.identifier],
    };
  }
}
