import type { BRInfo } from 'types/reihung';

export function getComfortSeats(br: BRInfo, klasse: 1 | 2): string | undefined {
  switch (br.identifier) {
    case '401':
      return klasse === 1 ? '11-36' : '11-57';
    case '402':
      return klasse === 1 ? '11-16, 21, 22' : '81-108';
    case '403':
    case '406':
      return klasse === 1 ? '12-26' : '11-38';
    case '406R':
      return klasse === 1 ? '12-26' : '11-37';
    case '407':
      return klasse === 1 ? '21-26, 31, 33, 35' : '31-55, 57';
    case '411':
      return klasse === 1 ? '41, 46, 52, 54-56' : '92, 94, 96, 98, 101-118';
    case '412.7':
      return klasse === 1 ? '44-53' : '11-44';
    case '412':
      return klasse === 1 ? '11-46' : '11-68';
    case '415':
      return klasse === 1 ? '52, 54, 56' : '81-88, 91-98';
    case 'MET':
      return klasse === 1 ? '61-66' : '91-106';
    case 'IC2':
      return klasse === 1 ? '73, 75, 83-86' : '31-38, 41-45, 47';
  }
}

export function getDisabledSeats(
  br: BRInfo,
  klasse: 1 | 2,
  wagenordnungsnummer: string,
): string | undefined {
  switch (br.identifier) {
    case '401':
      return klasse === 1 ? '51, 52, 53, 55' : '111-116';
    case '402':
      return klasse === 1 ? '12, 21' : '81, 85-88';
    case '403R':
    case '403':
      // 406 has no seat 64/66 Looks like no disabled seats either. At least for trains going to Amsterdam/NL
      // case '406':
      if (klasse === 1) return '64, 66';
      if (wagenordnungsnummer === '25' || wagenordnungsnummer === '35') {
        return br.identifier === '403R' ? '61, 63, 65-67' : '61, 63, 65, 67';
      }

      return '106, 108';
    case '407':
      return klasse === 1 ? '13, 15' : '11, 13, 15, 17';
    case '411':
      return klasse === 1 ? '21, 22' : '15-18';
    case '412.7':
      return klasse === 1 ? '12, 13' : '11-18';
    case '412':
      if (klasse === 1)
        return wagenordnungsnummer === '10' ? '12, 13' : '11, 14, 21';

      return wagenordnungsnummer === '1' ? '11-24' : '41, 45, 46';
    case '415':
      return klasse === 1 ? '21' : '15, 17';
  }
}
