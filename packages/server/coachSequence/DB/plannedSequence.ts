import { getSeatsForCoach } from 'server/coachSequence/specialSeats';
import { nameMap } from 'server/coachSequence/baureihe';
import axios from 'axios';
import type {
  CoachSequenceBaureihe,
  CoachSequenceGroup,
  CoachSequenceInformation,
} from 'types/coachSequence';

const apiUrl = process.env.PLANNED_API_URL;
const apiKey = process.env.PLANNED_API_KEY;

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
      await axios.get<CoachSequenceInformation>(
        `${apiUrl}/${trainNumber}/${initialDeparture.toISOString()}/${evaNumber}`,
        {
          headers: {
            'x-api-key': apiKey,
          },
        },
      )
    ).data;

    plannedSequence.sequence.groups.forEach((g) => {
      const br = getBRWithoutNameFromGroup(g);
      g.name = `${g.number}-planned`;
      if (br) {
        g.baureihe = {
          ...br,
          name: nameMap[br.identifier],
        };
        g.coaches.forEach((coach) => {
          coach.seats = getSeatsForCoach(coach, br.identifier);
        });
      }
    });
    return plannedSequence;
  } catch (e) {
    return undefined;
  }
}

function getBRWithoutNameFromGroup(
  group: CoachSequenceGroup,
): Omit<CoachSequenceBaureihe, 'name'> | undefined {
  // ICE
  if (group.name.startsWith('401_11')) {
    return {
      identifier: '401.9',
      baureihe: '401',
    };
  }
  if (group.name.startsWith('401_14')) {
    return {
      identifier: '401',
      baureihe: '401',
    };
  }
  if (group.name.startsWith('402')) {
    return {
      identifier: '402',
      baureihe: '402',
    };
  }
  if (group.name.startsWith('403E')) {
    return {
      identifier: '403.R',
      baureihe: '403',
    };
  }
  if (group.name.startsWith('406')) {
    return {
      identifier: '406',
    };
  }
  if (group.name.startsWith('403')) {
    return {
      identifier: '403',
      baureihe: '403',
    };
  }
  if (group.name.startsWith('406.01')) {
    return {
      identifier: '406',
      baureihe: '406',
    };
  }
  if (group.name.startsWith('406.02')) {
    return {
      identifier: '406.R',
      baureihe: '406',
    };
  }
  if (group.name.startsWith('412_12')) {
    return {
      identifier: '412',
      baureihe: '412',
    };
  }
  if (group.name.startsWith('407')) {
    return {
      identifier: '407',
      baureihe: '407',
    };
  }
  if (group.name.startsWith('411')) {
    return {
      identifier: '411',
      baureihe: '411',
    };
  }
  if (group.name.startsWith('412_13')) {
    return {
      identifier: '412.13',
      baureihe: '412',
    };
  }
  if (group.name.startsWith('412_07')) {
    return {
      identifier: '412.7',
      baureihe: '412',
    };
  }
  if (group.name.startsWith('406')) {
    return {
      identifier: '406',
      baureihe: '406',
    };
  }
  if (group.name.startsWith('415')) {
    return {
      identifier: '415',
      baureihe: '415',
    };
  }

  // IC
  if (group.name.startsWith('KISS')) {
    return {
      identifier: 'IC2.KISS',
    };
  }
  if (group.name.startsWith('Dosto')) {
    return {
      identifier: 'IC2.TWIN',
    };
  }
}
