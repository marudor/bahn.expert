import { BRInfo } from 'types/reihung';

const getATBR = (
  code: string,
  _serial: string,
  _fahrzeugTypes: string[]
): undefined | BRInfo => {
  switch (code) {
    case '4011':
      return {
        name: 'ICE T',
        BR: '411',
        serie: '1',
      };
  }
};
const getDEBR = (
  code: string,
  uicOrdnungsnummer: string,
  fahrzeugTypes: string[]
): undefined | BRInfo => {
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
    case '9812':
      return {
        name: 'ICE 4',
        BR: '412',
      };
    case '5401':
    case '5801':
    case '5802':
    case '5803':
    case '5804':
      return {
        name: 'ICE 1',
        BR: '401',
      };
    case '5402':
    case '5805':
    case '5806':
    case '5807':
    case '5808':
      return {
        name: 'ICE 2',
        BR: '402',
      };
    case '5403':
      return {
        name: 'ICE 3',
        BR: '403',
        serie:
          Number.parseInt(uicOrdnungsnummer.substr(1), 10) <= 37 ? '1' : '2',
        redesign: fahrzeugTypes.includes('WRmz'),
      };
    case '5406':
      return {
        name: 'ICE 3',
        BR: '406',
      };
    case '5407':
      return {
        name: 'ICE 3 Velaro',
        BR: '407',
      };
    case '5410':
      return {
        name: 'ICE S',
        BR: '410.1',
        noPdf: true,
      };
    case '5411':
      return {
        name: 'ICE T',
        BR: '411',
        serie: Number.parseInt(uicOrdnungsnummer, 10) <= 32 ? '1' : '2',
      };
    case '5415':
      return {
        name: 'ICE T',
        BR: '415',
      };
    case '5475':
      return {
        name: 'TGV',
        noPdf: true,
      };
  }
};

export default (
  fahrzeugnummer: string,
  fahrzeugTypes: string[]
): undefined | BRInfo => {
  const country = fahrzeugnummer.substr(2, 2);
  const code = fahrzeugnummer.substr(4, 4);
  const serial = fahrzeugnummer.substr(8, 3);

  let info;

  switch (country) {
    case '80':
      info = getDEBR(code, serial, fahrzeugTypes);
      break;
    case '81':
      info = getATBR(code, serial, fahrzeugTypes);
      break;
  }

  return info;
};
