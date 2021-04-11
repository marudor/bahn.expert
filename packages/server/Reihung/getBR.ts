import type { BRInfo, Fahrzeug } from 'types/reihung';

const getATBR = (
  code: string,
  _serial: string,
  _fahrzeuge: Fahrzeug[],
): undefined | Omit<BRInfo, 'name'> => {
  switch (code) {
    case '4011':
      return {
        BR: '411',
        identifier: '411.S1',
      };
  }
};
const getDEBR = (
  code: string,
  uicOrdnungsnummer: string,
  fahrzeuge: Fahrzeug[],
): undefined | Omit<BRInfo, 'name'> => {
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
      switch (fahrzeuge.length) {
        case 13:
          identifier = '412.13';
          break;
        case 7:
          identifier = '412.7';
          break;
      }
      return {
        identifier,
        BR: '412',
        noPdf: fahrzeuge.length !== 12,
      };
    }
    case '5401':
    case '5801':
    case '5802':
    case '5803':
    case '5804': {
      let identifier: '401' | '401.LDV' | '401.9' = '401';
      let noPdf = undefined;
      if (fahrzeuge.length === 11) {
        if (
          fahrzeuge.filter((f) => f.additionalInfo.klasse === 1).length === 2
        ) {
          identifier = '401.LDV';
        } else {
          identifier = '401.9';
        }
        noPdf = true;
      }
      return {
        identifier,
        BR: '401',
        noPdf,
      };
    }
    case '5402':
    case '5805':
    case '5806':
    case '5807':
    case '5808':
      return {
        BR: '402',
        identifier: '402',
      };
    case '5403':
      return {
        BR: '403',
        // @ts-expect-error this works
        identifier: `403.S${
          Number.parseInt(uicOrdnungsnummer.substr(1), 10) <= 37 ? '1' : '2'
        }`,
      };
    case '5406':
      return {
        BR: '406',
        identifier: '406',
      };
    case '5407':
      return {
        BR: '407',
        identifier: '407',
      };
    case '5410':
      return {
        BR: '410.1',
        identifier: '410.1',
        noPdf: true,
      };
    case '5411':
      return {
        BR: '411',
        // @ts-expect-error this works
        identifier: `411.S${
          Number.parseInt(uicOrdnungsnummer, 10) <= 32 ? '1' : '2'
        }`,
      };
    case '5415':
      return {
        BR: '415',
        identifier: '415',
      };
    case '5475':
      return {
        identifier: 'TGV',
        noPdf: true,
      };
  }
};

export default (
  fahrzeugnummer: string,
  fahrzeuge: Fahrzeug[],
): undefined | Omit<BRInfo, 'name'> => {
  const country = fahrzeugnummer.substr(2, 2);
  const code = fahrzeugnummer.substr(4, 4);
  const serial = fahrzeugnummer.substr(8, 3);

  let info;

  switch (country) {
    case '80':
      info = getDEBR(code, serial, fahrzeuge);
      break;
    case '81':
      info = getATBR(code, serial, fahrzeuge);
      break;
  }

  return info;
};
