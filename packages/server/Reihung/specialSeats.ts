import type { AdditionalFahrzeugInfo, BRInfo } from 'types/reihung';

export function getComfortSeats(
  br: BRInfo,
  klasse: AdditionalFahrzeugInfo['klasse'],
): string | undefined {
  switch (br.identifier) {
    case '401':
      return klasse === 1 ? '11-36' : '11-57';
    case '401.9':
      return klasse === 1 ? '12-31' : '11-44';
    case '402':
      return klasse === 1 ? '11-16, 21, 22' : '81-108';
    case '403':
    case '403.S1':
    case '403.S2':
    case '406':
      return klasse === 1 ? '12-26' : '11-38';
    case '403.R':
    case '406.R':
      return klasse === 1 ? '12-26' : '11-37';
    case '407':
      return klasse === 1 ? '21-26, 31, 33, 35' : '31-55, 57';
    case '411':
      return klasse === 1 ? '46, 52-56' : '92, 94, 96, 98, 101-118';
    case '412.7':
      return klasse === 1 ? '41, 44-53' : '11-44';
    case '412':
    case '412.13':
      return klasse === 1 ? '11-46' : '11-68';
    case '415':
      return klasse === 1 ? '52, 54, 56' : '81-88, 91-98';
    case 'MET':
      return klasse === 1 ? '61-66' : '91-106';
    case 'IC2.TWIN':
      return klasse === 1 ? '73, 75, 83-86' : '31-38, 41-45, 47';
    case 'IC2.KISS':
      return klasse === 3 ? '144, 145' : '55-68';
  }
}

export function getDisabledSeats(
  br: BRInfo,
  klasse: AdditionalFahrzeugInfo['klasse'],
  wagenordnungsnummer: string,
): string | undefined {
  switch (br.identifier) {
    case '401':
      return klasse === 1 ? '51, 52, 53, 55' : '111-116';
    case '401.9':
      return klasse === 1 ? '11, 13, 15' : '11, 13, 111-116';
    case '402':
      return klasse === 1 ? '12, 21' : '81, 85-88';
    case '403':
    case '403.R':
    case '403.S1':
    case '403.S2':
      // 406 has no seat 64/66 Looks like no disabled seats either. At least for trains going to Amsterdam/NL
      // case '406':
      if (klasse === 1) return '64, 66';
      if (wagenordnungsnummer === '25' || wagenordnungsnummer === '35') {
        // redesign slighlty different
        return ['403R', '403.S1R', '403.S2R'].includes(br.identifier)
          ? '61, 63, 65-67'
          : '61, 63, 65, 67';
      }

      return '106, 108';
    case '407':
      if (klasse === 1) return '13, 15';
      if (wagenordnungsnummer === '11' || wagenordnungsnummer === '21') {
        return '11-18';
      }
      return '28, 33-34';
    case '411':
      return klasse === 1 ? '21, 22' : '15-18';
    case '412.7':
      return klasse === 1 ? '12, 13' : '11-18';
    case '412':
    case '412.13':
      if (klasse === 1)
        return wagenordnungsnummer === '10' ? '12, 13' : '11, 14, 21';

      switch (wagenordnungsnummer) {
        case '1':
          return '11-24';
        case '8':
          return '11, 12';
        case '9':
          return '41, 45, 46';
      }
      break;
    case '415':
      return klasse === 1 ? '21' : '15, 17';
    case 'MET':
      return klasse === 1 ? '16, 21' : '12, 14, 16';
    case 'IC2.TWIN':
      return klasse === 1 ? '21, 71' : '25, 101-105, 171-173';
    case 'IC2.KISS':
      return klasse === 3 ? '143' : '21-26';
  }
}

export function getFamilySeats(br: BRInfo): string | undefined {
  switch (br.identifier) {
    case '401':
      return '81-116';
    case '401.9':
      return '91-116';
    case '402':
      return '61-78';
    case '403':
    case '403.R':
    case '403.S1':
    case '403.S2':
    case '406':
    case '406.R':
      return '11-28';
    case '407':
      return '11-28';
    case '411':
      return '11-18, 31-38';
    case '412.7':
      return '61-78';
    case '412':
    case '412.13':
      return '61-78';
    case 'MET':
      return '11-26';
    case 'IC2.TWIN':
      return '121, 123, 131-138';
    case 'IC2.KISS':
      return '42, 43, 45, 46, 52-56';
  }
}
