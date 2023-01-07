import notRedesigned from './notRedesigned.json';
import type {
  AvailableIdentifier,
  CoachSequenceBaureihe,
  CoachSequenceCoach,
} from 'types/coachSequence';

export const nameMap: Record<AvailableIdentifier, string> = {
  '401': 'ICE 1 (BR401)',
  '401.9': 'ICE 1 Kurz (BR401)',
  '401.LDV': 'ICE 1 Modernisiert (BR401)',
  '402': 'ICE 2 (BR402)',
  '403': 'ICE 3 (BR403)',
  '403.S1': 'ICE 3 (BR403 1. Serie)',
  '403.S2': 'ICE 3 (BR403 2. Serie)',
  '403.R': 'ICE 3 (BR403 Redesign)',
  '406': 'ICE 3 (BR406)',
  '406.R': 'ICE 3 (BR406 Redesign)',
  '407': 'ICE 3 Velaro (BR407)',
  '408': 'ICE 3neo (BR408)',
  '410.1': 'ICE S (BR410.1)',
  '411': 'ICE T (BR411)',
  '411.S1': 'ICE T (BR411 1. Serie)',
  '411.S2': 'ICE T (BR411 2. Serie)',
  '412': 'ICE 4 (BR412)',
  '412.7': 'ICE 4 Kurz (BR412)',
  '412.13': 'ICE 4 Lang (BR412)',
  '415': 'ICE T Kurz (BR415)',
  'IC2.TWIN': 'IC 2 (Twindexx)',
  'IC2.KISS': 'IC 2 (KISS)',
  MET: 'MET',
  TGV: 'TGV',
};

const getATBR = (
  code: string,
  _serial: string,
  _coaches: Pick<CoachSequenceCoach, 'class'>[],
): undefined | Omit<CoachSequenceBaureihe, 'name'> => {
  switch (code) {
    case '4011':
      return {
        baureihe: '411',
        identifier: '411.S1',
      };
  }
};
const getDEBR = (
  code: string,
  uicOrdnungsnummer: string,
  coaches: Pick<CoachSequenceCoach, 'class'>[],
  tzn?: string,
): undefined | Omit<CoachSequenceBaureihe, 'name'> => {
  switch (code) {
    case '0812':
    case '1412':
    case '1812':
    case '2412':
    case '2812':
    case '3412':
    case '4812':
    case '5812':
    case '6412':
    case '6812':
    case '7412':
    case '7812':
    case '8812':
    case '9412':
    case '9812': {
      let identifier: '412' | '412.13' | '412.7' = '412';
      switch (coaches.length) {
        case 13:
          identifier = '412.13';
          break;
        case 7:
          identifier = '412.7';
          break;
      }
      return {
        identifier,
        baureihe: '412',
      };
    }
    case '5401':
    case '5801':
    case '5802':
    case '5803':
    case '5804': {
      let identifier: '401' | '401.LDV' | '401.9' = '401';
      if (coaches.length === 11) {
        identifier =
          coaches.filter((f) => f.class === 1).length === 2
            ? '401.LDV'
            : '401.9';
      }
      return {
        identifier,
        baureihe: '401',
      };
    }
    case '5402':
    case '5805':
    case '5806':
    case '5807':
    case '5808':
      return {
        baureihe: '402',
        identifier: '402',
      };
    case '5403': {
      const identifier: AvailableIdentifier = `403.S${
        Number.parseInt(uicOrdnungsnummer.slice(1), 10) <= 37 ? '1' : '2'
      }`;
      return {
        baureihe: '403',
        identifier: tzn && notRedesigned.includes(tzn) ? identifier : '403.R',
      };
    }
    case '5406':
      return {
        baureihe: '406',
        identifier: tzn?.endsWith('4651') ? '406.R' : '406',
      };
    case '5407':
      return {
        baureihe: '407',
        identifier: '407',
      };
    case '5410':
      return {
        baureihe: '410.1',
        identifier: '410.1',
      };
    case '5408':
      return {
        baureihe: '408',
        identifier: '408',
      };
    case '5411':
      return {
        baureihe: '411',
        identifier: `411.S${
          Number.parseInt(uicOrdnungsnummer, 10) <= 32 ? '1' : '2'
        }`,
      };
    case '5415':
      return {
        baureihe: '415',
        identifier: '415',
      };
    case '5475':
      return {
        identifier: 'TGV',
      };
  }
};

export const getBaureiheByUIC = (
  uic: string,
  coaches: Pick<CoachSequenceCoach, 'class'>[],
  tzn?: string,
): undefined | CoachSequenceBaureihe => {
  const country = uic.slice(2, 4);
  const code = uic.slice(4, 8);
  const serial = uic.slice(8, 11);
  let br: undefined | Omit<CoachSequenceBaureihe, 'name'>;
  switch (country) {
    case '80':
      br = getDEBR(code, serial, coaches, tzn);
      break;
    case '81':
      br = getATBR(code, serial, coaches);
      break;
  }
  if (!br) return undefined;

  return {
    ...br,
    name: nameMap[br.identifier],
  };
};

export const getBaureiheByCoaches = (
  coaches: CoachSequenceCoach[],
): CoachSequenceBaureihe | undefined => {
  let identifier: undefined | AvailableIdentifier;
  for (const c of coaches) {
    if (c.type === 'Apmbzf') {
      identifier = 'MET';
      break;
    }
    if (c.type === 'DBpbzfa') {
      identifier = 'IC2.TWIN';
      break;
    }
    if (c.type === 'DBpdzfa') {
      identifier = 'IC2.KISS';
      break;
    }
  }
  if (identifier === 'IC2.KISS') {
    for (const c of coaches) {
      switch (c.type) {
        case 'DABpzfa':
          c.features.comfort = true;
          c.features.disabled = true;
          break;
        case 'DBpbza':
          c.features.family = true;
          break;
        case 'DBpdzfa':
          c.features.bike = true;
          break;
      }
    }
  }
  if (identifier) {
    return {
      identifier,
      name: nameMap[identifier],
    };
  }
};
