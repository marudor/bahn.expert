import { checkSecrets } from '@/server/checkSecret';
import { getSeatsForCoach } from '@/server/coachSequence/specialSeats';
import { nameMap } from '@/server/coachSequence/baureihe';
import Axios from 'axios';
import type {
  CoachSequenceBaureihe,
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
      const br = getBRFromGroupName(g.name);
      g.baureihe = br;
      g.name = `${g.number}-planned`;
      if (br) {
        for (const coach of g.coaches) {
          coach.seats = getSeatsForCoach(coach, br.identifier);
        }
      }
    }
    return plannedSequence;
  } catch {
    return undefined;
  }
}

function getBRWithoutNameFromGroupName(
  groupName: string,
): Omit<CoachSequenceBaureihe, 'name'> | undefined {
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
  if (groupName.startsWith('KISS')) {
    return {
      identifier: 'IC2.KISS',
    };
  }
  if (groupName.startsWith('Dosto')) {
    return {
      identifier: 'IC2.TWIN',
    };
  }
}

export function getBRFromGroupName(
  groupName: string,
): CoachSequenceBaureihe | undefined {
  const brWithoutName = getBRWithoutNameFromGroupName(groupName);
  if (brWithoutName) {
    return {
      ...brWithoutName,
      name: nameMap[brWithoutName.identifier],
    };
  }
}
